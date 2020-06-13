const Path = require("../../src/Path");
const params = require("./parameters/Path.params");

describe("constructor", () => {
	test.each(params.constructor)(
		"#%#",
		(path, expected_path, expected_basename) => {
			const path_obj = new Path(path);
			expect(path_obj.toString()).toBe(expected_path);
			expect(path_obj.basename).toBe(expected_basename);
		},
	);
});

describe("normalize method", () => {

	describe("Normal flow", () => {
		test.each(params.normalize)(
			"#%#",
			(path, expected_path) => {
				expect(Path.normalize(path)).toBe(expected_path);
			},
		);
	});

	test("Throws Error", () => {
		const obj = {};
		obj.toString = undefined;

		expect(() => {
			Path.normalize(obj);
		}).toThrow(/toString/gi);
	});

});

describe("fastForward method", () => {
	test.each(params.fastForward)(
		"#%#",
		(path, target, expected_path) => {
			const result = new Path(path).fastForward(target);

			expect(result).toBeInstanceOf(Path);
			expect(result.toString()).toBe(expected_path);
		},
	);
});

describe("publicUrl method", () => {

	describe("Normal flow", () => {
		test.each(params.publicUrl.normal_flow)(
			"#%#",
			(path, public_path, expected_url) => {
				const result = new Path(path).publicUrl(public_path);

				expect(result).toBe(expected_url);
			},
		);
	});

	describe("Throws Error", () => {
		test.each(params.publicUrl.throws_error)(
			"#%#",
			(path, public_path) => {
				const path_obj = new Path(path);

				expect(() => {
					path_obj.publicUrl(public_path);
				}).toThrow(/must be a parent of/gi);
			},
		);
	});

});

describe("join method", () => {

	test("Throws Error", () => {
		const path_obj = new Path();
		const obj = {};
		obj.toString = undefined;

		expect(() => {
			path_obj.join("sub1", "sub2", new Path("x/y/z"), obj);
		}).toThrow(/toString/g);
	});

	test("Normal flow", () => {

		const result1 = new Path().join("filename.txt", "");
		expect(result1).toBeInstanceOf(Path);
		expect(result1.toString()).toBe(`${CWD}${SEP}filename.txt`);

		const result2 = result1.join("/sub1", "/sub1/sub2", "/sub1////sub2\\\\sub3", new Path(".file"));
		expect(result2).toBeInstanceOf(Path);
		expect(result2.toString()).toBe(
			`${CWD}${SEP}filename.txt`
			+ `${SEP}sub1`
			+ `${SEP}sub1${SEP}sub2`
			+ `${SEP}sub1${SEP}sub2${SEP}sub3`
			+ `${SEP}${new Path(".file").toString().replace(/^\//, "").replace(/[\\/]/g, SEP)}`,
		);
	});

});
