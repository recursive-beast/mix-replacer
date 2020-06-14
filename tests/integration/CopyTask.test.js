const fs = require("fs");
const path = require("path");
const Path = require("../../src/Path");
const CopyTask = require("../../src/CopyTask");
const {getTempDir,withHashQuery} = require("../helpers");

test("Normal flow", () => {
	const tmpdir = getTempDir();
	const src = "tests/integration/resources/browserconfig.xml";
	const target_dir = path.join(tmpdir, "non", "existing", "dir");
	const expected_target_path = path.join(target_dir, "browserconfig.xml");

	const task = new CopyTask(src, target_dir);
	const manifest = {
		"/images/mstile-150x150.png": withHashQuery("/images/mstile-150x150.png"),
		"/images/mstile-70x70.png": "/images/mstile-70x70.png",
		"/images/mstile-310x310.png": withHashQuery("/images/mstile-310x310.png"),
	};

	return task.run(manifest)
	           .then(target => {
		           expect(target).toBeInstanceOf(Path);

		           const target_path = target.toString();
		           expect(target_path).toBe(expected_target_path);

		           const target_content = fs.readFileSync(target_path).toString();
		           expect(target_content).toMatchSnapshot();
	           });
});

test("Throws Error", () => {
	const tmpdir = getTempDir();
	const src = "non/existent/file.txt";
	const target_dir = path.join(tmpdir, "non", "existing", "dir");
	const task = new CopyTask(src, target_dir);

	expect.assertions(2);

	return task.run({})
	           .catch(e => {
		           expect(e).toBeInstanceOf(Error);
		           expect(e.toString()).toMatch(/ENOENT/g);
	           });
});
