const mix = require("laravel-mix");
const fs = require("fs");
const path = require("path");
const CopyAndReplacePlugin = require("../../src/CopyAndReplacePlugin");
const {getTempDir, withHashQuery} = require("../helpers");

const public_urls = [
	"/images/touch/homescreen48.png",
	"/images/touch/homescreen72.png",
	"/images/touch/homescreen96.png",
	"/images/touch/homescreen168.png",
	"/images/touch/homescreen192.png",
	"/images/mstile-150x150.png",
	"/images/mstile-70x70.png",
	"/images/mstile-310x310.png",
	"/js/jquery.js",
	"/js/my-background.js",
	"/images/button/geo-38.png",
	"/popup/geo.html",
];

describe("Normal flow", () => {
	test.each(["with versioning", "without versioning"])(
		"%s",
		(param, done) => {
			const with_versioning = param === "with versioning";
			const tmpdir = getTempDir();
			const plugin = new CopyAndReplacePlugin();
			const public_dir = `${tmpdir}${SEP}public`;
			const Stats = {compilation: {assets: {}}};

			// Setting up a mock manifest object
			Mix.manifest.manifest = public_urls.reduce((accumulator, public_url) => {

				accumulator[public_url] = with_versioning
				                          ? withHashQuery(public_url)
				                          : public_url;

				return accumulator;
			}, {});

			const callback = () => {

				try {
					expect(Stats).toStrictEqual({
						compilation: {
							assets: {
								"/browserconfig.xml": {size: expect.any(Function), emitted: true},
								"/config.json": {size: expect.any(Function), emitted: true},
								"/config_files/manifest.json": {size: expect.any(Function), emitted: true},
							},
						},
					});

					const assets = Stats.compilation.assets;

					const assets_data = Object.keys(assets).reduce(
						(accumulator, public_url) => {
							const target_public_path = path.join(public_dir, public_url);

							accumulator[public_url] = {
								is_expected_size: assets[public_url].size() === fs.statSync(target_public_path).size,
								content: fs.readFileSync(target_public_path).toString(),
							};

							return accumulator;
						}, {});

					expect({
						assets_data: assets_data,
						manifest: require(`${public_dir}${SEP}mix-manifest.json`),
					}).toMatchSnapshot();

					done();
				} catch (e) {
					done(e);
				} finally {
					Mix.components.has.mockRestore();
				}

			};

			// This mock is necessary since mix.version() is not available for us right now
			jest.spyOn(Mix.components, "has").mockReturnValue(with_versioning);

			mix.setPublicPath(public_dir);
			plugin.register("tests/integration/resources/*", public_dir);
			plugin.register("tests/integration/resources/sub1/**/*", `${public_dir}${SEP}config_files`);
			plugin.onCompilerDone(Stats, callback);
		},
	);
});

test("Throws Error", () => {
	const plugin = new CopyAndReplacePlugin();

	expect(() => {
		const tmpdir = getTempDir();
		plugin.register("non/existant/**/*", tmpdir);
	}).toThrow(/didn't yield any results/g);
});
