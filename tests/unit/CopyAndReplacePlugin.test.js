const mix = require("laravel-mix");
const glob = require("glob");
const fs = require("fs");
const params = require("./parameters/CopyAndReplacePlugin.params");
const CopyAndReplacePlugin = require("../../src/CopyAndReplacePlugin");
const CopyTask = require("../../src/CopyTask");
const Path = require("../../src/Path");

describe("register method", function () {

	beforeAll(() => {
		jest.spyOn(glob, "sync");
	});

	afterEach(() => {
		glob.sync.mockClear();
	});

	afterAll(() => {
		glob.sync.mockRestore();
	});

	test("Throws Error", () => {
		glob.sync.mockReturnValue([]);
		const plugin = new CopyAndReplacePlugin();

		expect(() => {
			plugin.register("*", CWD);
		}).toThrow(/didn't yield any results/gi);
	});

	describe("Normal Flow", () => {

		test.each(params.register)(
			"#%#",
			(seed_tasks, src_paths, pattern, target_dir, public_path, expected_target_dir) => {
				glob.sync.mockReturnValue(src_paths);
				const expected_new_tasks = src_paths.map(src => new CopyTask(
					src,
					new Path(expected_target_dir).fastForward(public_path),
				));

				// Exposed by laravel-mix
				const original_public_path = Config.publicPath;
				Config.publicPath = public_path;

				const plugin = new CopyAndReplacePlugin();
				plugin.tasks = [...seed_tasks];
				plugin.register(pattern, target_dir);

				expect(glob.sync).toBeCalledTimes(1);
				expect(glob.sync).toHaveBeenCalledWith(pattern, expect.objectContaining({nodir: true}));
				expect(plugin.tasks).toStrictEqual([...seed_tasks, ...expected_new_tasks]);

				Config.publicPath = original_public_path;
			},
		);
	});

});

test("boot method", () => {
	jest.spyOn(mix, "override").mockImplementation();
	const plugin = new CopyAndReplacePlugin();

	plugin.boot();

	expect(mix.override).toHaveBeenCalledTimes(1);

	const callback = mix.override.mock.calls[0][0];
	expect(callback).toBeInstanceOf(Function);

	const obj1 = {};
	callback(obj1);
	expect(obj1).toStrictEqual({plugins: [plugin]});

	const existing_plugins = [Object.freeze({}), Object.freeze({}), Object.freeze({})];

	const obj2 = {plugins: [...existing_plugins]};
	callback(obj2);
	expect(obj2).toStrictEqual({plugins: [...existing_plugins, plugin]});

	mix.override.mockRestore();
});

test("apply method", () => {
	const plugin = new CopyAndReplacePlugin();
	const done_tapAsync = jest.fn();
	const compiler = {
		hooks: {
			done: {
				tapAsync: done_tapAsync,
			},
		},
	};

	plugin.apply(compiler);

	expect(done_tapAsync).toHaveBeenCalledTimes(1);
	expect(done_tapAsync).toHaveBeenCalledWith(
		CopyAndReplacePlugin.name,
		expect.any(Function),
	);
});

describe("addAssetToManifest method", () => {

	beforeAll(() => {
		jest.spyOn(Mix.components, "has");
		jest.spyOn(Mix.manifest, "hash").mockImplementation();
		jest.spyOn(Mix.manifest, "add").mockImplementation();
	});

	afterEach(() => {
		Mix.components.has.mockClear();
		Mix.manifest.add.mockClear();
		Mix.manifest.hash.mockClear();
	});

	afterAll(() => {
		Mix.components.has.mockRestore();
		Mix.manifest.add.mockRestore();
		Mix.manifest.hash.mockRestore();
	});

	test("With versioning", () => {
		const plugin = new CopyAndReplacePlugin();

		Mix.components.has.mockReturnValue(true);

		plugin.addAssetToManifest(new Path("public/sub/file.txt"), "public");

		expect(Mix.manifest.add).not.toHaveBeenCalled();
		expect(Mix.manifest.hash).toHaveBeenCalledTimes(1);
		expect(Mix.manifest.hash).toHaveBeenCalledWith("sub/file.txt");
	});

	test("Without versioning", () => {
		const plugin = new CopyAndReplacePlugin();

		Mix.components.has.mockReturnValue(false);

		plugin.addAssetToManifest(new Path("public/file.txt"), "public");

		expect(Mix.manifest.hash).not.toHaveBeenCalled();
		expect(Mix.manifest.add).toHaveBeenCalledTimes(1);
		expect(Mix.manifest.add).toHaveBeenCalledWith("file.txt");
	});

});

test("addAssetToStats method", () => {
	const sizes = [...Array(3)].map(() => Math.floor(Math.random() * 10000));

	jest.spyOn(fs, "statSync")
	    .mockReturnValueOnce({size: sizes[0]})
	    .mockReturnValueOnce({size: sizes[1]})
	    .mockReturnValueOnce({size: sizes[2]});

	const plugin = new CopyAndReplacePlugin();
	const Stats = {
		compilation: {
			assets: {},
		},
	};

	plugin.addAssetToStats(Stats, new Path("public/sub1/sub2/file.txt"), "public");
	plugin.addAssetToStats(Stats, new Path("public/sub1/file.txt"), "public");
	plugin.addAssetToStats(Stats, new Path("public/file.txt"), "public");

	expect(Stats).toStrictEqual(
		{
			compilation: {
				assets: {
					"/sub1/sub2/file.txt": {
						size: expect.any(Function),
						emitted: true,
					},
					"/sub1/file.txt": {
						size: expect.any(Function),
						emitted: true,
					},
					"/file.txt": {
						size: expect.any(Function),
						emitted: true,
					},
				},
			},
		},
	);

	const assets = Stats.compilation.assets;

	expect(assets["/sub1/sub2/file.txt"].size()).toBe(sizes[0]);
	expect(assets["/sub1/file.txt"].size()).toBe(sizes[1]);
	expect(assets["/file.txt"].size()).toBe(sizes[2]);

	fs.statSync.mockRestore();
});
