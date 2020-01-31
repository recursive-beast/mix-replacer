"use strict";
const path = require("path");
const CopyTask = require("../src/CopyTask");
const mix = require("laravel-mix");

mix.setPublicPath("spec/test_public_dir");

const inputs = [
	{ input: "", expected: "spec/test_public_dir" },
	{ input: "/", expected: "spec/test_public_dir" },
	{ input: ".", expected: "spec/test_public_dir" },
	{ input: "..", expected: "spec/test_public_dir" },
	{ input: "../", expected: "spec/test_public_dir" },
	{ input: "../../", expected: "spec/test_public_dir" },
	{ input: "../..", expected: "spec/test_public_dir" },
	{ input: "....", expected: "spec/test_public_dir" },
	{ input: "..../", expected: "spec/test_public_dir" },
	{ input: "spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "/spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "./spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "../spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "../../spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "./../../spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "../../../spec/test_public_dir", expected: "spec/test_public_dir" },
	{ input: "./spec/test_public_dir/dirname", expected: "spec/test_public_dir/dirname" },
	{
		input: "../spec/test_public_dir/dirname",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "../../spec/test_public_dir/dirname",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "./../../spec/test_public_dir/dirname",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "../../../spec/test_public_dir/dirname",
		expected: "spec/test_public_dir/dirname"
	},
	{ input: "..../spec/test_public_dir", expected: "spec/test_public_dir" },
	{
		input: "spec/test_public_dir.ext",
		expected: "spec/test_public_dir/spec"
	},
	{ input: "spec/test_public_dir/dirname", expected: "spec/test_public_dir/dirname" },
	{ input: "dirname", expected: "spec/test_public_dir/dirname" },
	{ input: "/dirname", expected: "spec/test_public_dir/dirname" },
	{ input: "./dirname", expected: "spec/test_public_dir/dirname" },
	{ input: "../dirname/something", expected: "spec/test_public_dir/dirname/something" },
	{
		input: "../../dirname/something",
		expected: "spec/test_public_dir/dirname/something"
	},
	{
		input: "dirname/something.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "dirname///something.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "dirname\\/something.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "dirname\\something.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "\\dirname/something.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "/dirname/something.wskfh",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "./dirname/something.zoeu",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "../dirname/something.qslkdj",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "../..\\dirname/something.env",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "../../dirname\\\\something.png",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "../../dirname/something.xml",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "..../dirname/something.json",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: ".dirname/something.abc",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "dirname/.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: "dirname\\.ext",
		expected: "spec/test_public_dir/dirname"
	},
	{
		input: ".dirname/wsjdhsd/qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirname/wsjdhsd/qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirname\\wsjdhsd\\qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirname/wsjdhsd\\qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirname/wsjdhsd/qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirnam.e/w.sjdhsd/..qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd"
	},
	{
		input: "dirname./wsjdhsd/../qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirname./wsjdhsd/.////qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "dirname.\\/wsjdhsd/./\\\\/qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		input: "..\\dirname.\\/wsjdhsd/./\\\\/qugd",
		expected: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	}
];

for (const input of inputs) {
	input.expected = path.normalize(input.expected);
}

describe("CopyTask", () => {
	it("should force the target file path to be inside the public path", () => {
		for (const input of inputs) {
			var result = CopyTask.prototype.normalizeDir(input.input);
			expect(result).toBe(input.expected);
		}
	});

	it("should throw an error if source file doesn't exist", () => {
		const src_inputs = [
			"",
			".",
			"..",
			"qsjdh",
			"/somefile",
			"/somefile.txt",
			"nonexistant.ts",
			"blabla.js",
			"folder/sub/xxxxksd.json",
			"sqdhk/dsqkhd/shd",
			":!:;osqjd",
			"zdaze_àazçe",
			"86sq74s5df"
		];

		for (const input of src_inputs) {
			expect(() => {
				new CopyTask(input);
			}).toThrowError(`"${input}" doesn't exist`);
		}
	});

	it("should append the source file name to the target dir", () => {
		const valid_src = [
			"spec/test_resources_dir/src1.xml",
			"spec/test_resources_dir/src2.json",
			"spec/test_resources_dir/sub/src3.xml",
			"spec/test_resources_dir/sub/src4.json"
		];

		for (const src of valid_src) {
			var file_name = path.basename(src);

			for (const input of inputs) {
				var task = new CopyTask(src, input.input);

				expect(task.target).toBe(path.join(input.expected, file_name));
			}
		}
	});
});
