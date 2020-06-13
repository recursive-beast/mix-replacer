const fs = require("fs");
const CopyTask = require("../../src/CopyTask");
const Path = require("../../src/Path");
const params = require("./parameters/CopyTask.params");

describe("constructor", () => {

	test("Throws error", () => {
		expect(() => {
			new CopyTask("/", "/sub1/sub2");
		}).toThrow(/not a file path/gi);
	});

	describe("Normal flow", () => {
		test.each(params.constructor)(
			"#%#",
			(src, target_dir, expected_target) => {
				const task = new CopyTask(src, target_dir);

				expect(task.src).toBeInstanceOf(Path);
				expect(task.src).toStrictEqual(new Path(src));

				expect(task.target_dir).toBeInstanceOf(Path);
				expect(task.target_dir).toStrictEqual(new Path(target_dir));

				expect(task.target).toBeInstanceOf(Path);
				expect(task.target).toStrictEqual(new Path(expected_target));
			},
		);
	});

});

test("ensureTargetDir method", () => {
	const spy = jest.spyOn(fs, "mkdirSync").mockImplementation();
	const bound_this = {target_dir: new Path("/sub1/sub2/sub3")};
	const ensureTargetDir = CopyTask.prototype.ensureTargetDir.bind(bound_this);

	ensureTargetDir();

	expect(spy).toBeCalledTimes(1);
	expect(spy).toHaveBeenCalledWith(
		new Path("/sub1/sub2/sub3").toString(),
		expect.objectContaining({recursive: true}),
	);

	spy.mockRestore();
});

describe("run method", function () {

	beforeAll(() => {
		jest.spyOn(global, "Promise").mockImplementation();
	});

	beforeEach(() => {
		Promise.mockClear();
	});

	afterAll(() => {
		Promise.mockRestore();
	});

	test("Not already running", () => {
		const ensureTargetDirMock = jest.fn();
		const bound_this = {ensureTargetDir: ensureTargetDirMock};
		const run = CopyTask.prototype.run.bind(bound_this);

		const result = run();

		expect(ensureTargetDirMock).toHaveBeenCalledTimes(1);
		expect(result).toBeInstanceOf(Promise);
		expect(bound_this.promise).toBe(result);
	});

	test("Already running", () => {
		const ensureTargetDirMock = jest.fn();
		const promise = new Promise(); // This is a mocked promise
		const bound_this = {promise: promise, ensureTargetDir: ensureTargetDirMock};
		const run = CopyTask.prototype.run.bind(bound_this);

		const result = run();

		expect(ensureTargetDirMock).toHaveBeenCalledTimes(0);
		expect(result).toBe(promise);
	});

});
