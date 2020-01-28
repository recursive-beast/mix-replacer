"use strict";
const path = require("path");
const CopyTask = require("../src/CopyTask");
const mix = require("laravel-mix");

mix.setPublicPath("spec/test_public_dir");

const dir_inputs = [
	{ dir: "", expected_dir: "spec/test_public_dir" },
	{ dir: "/", expected_dir: "spec/test_public_dir" },
	{ dir: ".", expected_dir: "spec/test_public_dir" },
	{ dir: "..", expected_dir: "spec/test_public_dir" },
	{ dir: "../", expected_dir: "spec/test_public_dir" },
	{ dir: "../../", expected_dir: "spec/test_public_dir" },
	{ dir: "../..", expected_dir: "spec/test_public_dir" },
	{ dir: "....", expected_dir: "spec/test_public_dir" },
	{ dir: "..../", expected_dir: "spec/test_public_dir" },
	{ dir: "spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "/spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "./spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "../spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "../../spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "./../../spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "../../../spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{ dir: "./spec/test_public_dir/dirname", expected_dir: "spec/test_public_dir/dirname" },
	{
		dir: "../spec/test_public_dir/dirname",
		expected_dir: "spec/test_public_dir/dirname"
	},
	{
		dir: "../../spec/test_public_dir/dirname",
		expected_dir: "spec/test_public_dir/dirname"
	},
	{
		dir: "./../../spec/test_public_dir/dirname",
		expected_dir: "spec/test_public_dir/dirname"
	},
	{
		dir: "../../../spec/test_public_dir/dirname",
		expected_dir: "spec/test_public_dir/dirname"
	},
	{ dir: "..../spec/test_public_dir", expected_dir: "spec/test_public_dir" },
	{
		dir: "spec/test_public_dir.ext",
		expected_dir: "spec/test_public_dir"
	},
	{ dir: "spec/test_public_dir/dirname", expected_dir: "spec/test_public_dir/dirname" },
	{ dir: "dirname", expected_dir: "spec/test_public_dir/dirname" },
	{ dir: "/dirname", expected_dir: "spec/test_public_dir/dirname" },
	{ dir: "./dirname", expected_dir: "spec/test_public_dir/dirname" },
	{ dir: "../dirname/something", expected_dir: "spec/test_public_dir/dirname/something" },
	{
		dir: "../../dirname/something",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "dirname/something.ext",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "dirname///something.ext",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "dirname\\/something.ext",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "dirname\\something.ext",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "\\dirname/something.ext",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "/dirname/something.wskfh",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "./dirname/something.zoeu",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "../dirname/something.qslkdj",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "../..\\dirname/something.env",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "../../dirname\\\\something.png",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "../../dirname/something.xml",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "..../dirname/something.json",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: ".dirname/something.abc",
		expected_dir: "spec/test_public_dir/dirname/something"
	},
	{
		dir: "dirname/.ext",
		expected_dir: "spec/test_public_dir/dirname"
	},
	{
		dir: "dirname\\.ext",
		expected_dir: "spec/test_public_dir/dirname"
	},
	{
		dir: ".dirname/wsjdhsd/qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname/wsjdhsd/qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname\\wsjdhsd\\qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname/wsjdhsd\\qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname/wsjdhsd/qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirnam.e/w.sjdhsd/..qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname./wsjdhsd/../qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname./wsjdhsd/.////qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "dirname.\\/wsjdhsd/./\\\\/qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	},
	{
		dir: "..\\dirname.\\/wsjdhsd/./\\\\/qugd",
		expected_dir: "spec/test_public_dir/dirname/wsjdhsd/qugd"
	}
];

for (const input of dir_inputs) {
	input.expected_dir = path.normalize(input.expected_dir);
}

describe("CopyTask", () => {
	it("should force the target file path to be inside the public path", () => {
		for (const input of dir_inputs) {
			var dir = CopyTask.prototype.normalizeDir(input.dir);
			expect(dir).toBe(input.expected_dir);
		}
	});

	it("should throw an error if source file doesn't exist", () => {
		const inputs = [
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

		for (const input of inputs) {
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

			for (const input of dir_inputs) {
				var task = new CopyTask(src, input.dir);

				expect(task.target).toBe(path.join(input.expected_dir, file_name));
			}
		}
	});
});
