"use strict";
//
// we'll call {{... some content ...}} a block
//
// when the Transformer finds a block, it should remove the surrounding braces
// and if the content is a key for the Mix.manifest.manifest object, it should be replaced with the corresponding value
//
// when generating a random string you must :
//
// - exclude "{" to avoid opening an unexpected block
// - exclude "}" to avoid closing an already opened block unexpectedly
// - exclude "/" to avoid producing an unexpected valid Mix.manifest.manifest key
//
// you can combine these excludes based on the spec

const { Readable, Writable, Transform, pipeline } = require("stream");
const Transformer = require("../src/Transformer");
const randomString = require("./helpers/randomString");
const mix = require("laravel-mix");

mix.setPublicPath("spec/test_public_dir");

Mix.manifest.hash("compiledByMix.xml");
Mix.manifest.hash("compiledByMix2.json");
Mix.manifest.hash("sub/compiledByMix3.xml");
Mix.manifest.hash("sub/compiledByMix4.json");

const manifest = { ...Mix.manifest.manifest };
const manifest_keys = Object.keys(manifest);

// ------------------------------------------------------------------|
// ------------------- global test functions ------------------------|
// ------------------------------------------------------------------|

function testPipeline(input) {
	return new Promise((resolve, reject) => {
		var result = "";

		const r = Readable.from(input);

		const w = new Writable({
			write(chunk, enc, cb) {
				result += chunk.toString();

				cb();
			}
		});

		const t = new Transformer();

		pipeline(r, t, w, e => {
			if (e) reject(e);
			else resolve(result);
		});
	});
}

// ------------------------------------------------------------------|

function startTesting(inputs, done) {
	const testPipelines = inputs.map(({ input }) => {
		if (!Array.isArray(input)) input = [input];

		return testPipeline(input);
	});

	Promise.allSettled(testPipelines).then(results => {
		results.forEach(({ value, reason }, i) => {
			// if what's expected is an error
			if (typeof inputs[i].expected === "object") {
				expect(reason)
					.withContext(`input ${i}`)
					.toBeInstanceOf(Error);

				if (reason)
					expect(reason.message)
						.withContext(`input ${i} Error message`)
						.toBe(inputs[i].expected.message);

				return;
			}

			expect(value === inputs[i].expected)
				.withContext(`input ${i}`)
				.toBe(true, "result is different than expected");
		});

		done();
	});
}

// ------------------------------------------------------------------|

function getInput(inputString) {
	const input = [];
	var breakpoints = [];
	const quantity = Math.random() * 10;

	for (var j = 0; j < quantity; j++) {
		breakpoints.push(Math.floor(Math.random() * (inputString.length + 1)));
	}

	breakpoints.sort((a, b) => a - b);
	breakpoints.unshift(0);
	breakpoints.push(inputString.length);

	for (var j = 0; j < breakpoints.length - 1; j++) {
		var chunk = inputString.substring(breakpoints[j], breakpoints[j + 1]);
		input.push(chunk);
	}

	return input;
}

// ------------------------------------------------------------------|
// -------------------------- specs ---------------------------------|
// ------------------------------------------------------------------|

describe("Transformer", () => {
	beforeAll(() => {
		this.originalTO = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});

	afterAll(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = this.originalTO;
	});

	it("should be a Transform stream", () => {
		const t = new Transformer();
		expect(t).toBeInstanceOf(Transform);
	});

	it("should implement a _transform method", () => {
		const t = new Transformer();
		expect(t._transform).toBeInstanceOf(Function);
	});

	it("should implement a _flush method", () => {
		const t = new Transformer();
		expect(t._flush).toBeInstanceOf(Function);
	});

	it("should not transform input", done => {
		const inputs = [
			{ input: [""], expected: "" },
			{ input: ["{"], expected: "{" },
			{ input: ["}"], expected: "}" },
			{ input: ["/"], expected: "/" },
			{ input: ["{{"], expected: "{{" },
			{ input: ["}}"], expected: "}}" },
			{ input: ["//"], expected: "//" }
		];

		for (let i = 1; i < 4; i++) {
			for (let j = 0; j < 50; j++) {
				var s = randomString(i);
				inputs.push({ input: [s], expected: s });
			}
		}

		for (let i = 0; i < 50; i++) {
			var s = randomString(null, "{");
			inputs.push({ input: [s], expected: s });
		}

		for (let i = 0; i < 50; i++) {
			var input = [
				randomString(null, "{", "}"),
				randomString(null, "{", "}"),
				randomString(null, "{", "}"),
				randomString(null, "{", "}"),
				randomString(null, "{", "}")
			];

			input[i % 5] = randomString(null, "{") + "{{" + randomString(null, "{", "}");

			inputs.push({ input, expected: input.join("") });
		}

		startTesting(inputs, done);
	});

	it("should remove block braces without replacing the content", done => {
		const inputs = [
			{ input: ["{{}}"], expected: "" },
			{ input: ["{{some/content}}"], expected: "some/content" },
			{ input: ["{{", "}}"], expected: "" },
			{ input: ["{{some/public/url", "}}"], expected: "some/public/url" },
			{
				input: ["{{", "does/not/exist/in manifest}}"],
				expected: "does/not/exist/in manifest"
			},
			{ input: ["{{some/", "content}}"], expected: "some/content" }
		];

		for (let i = 0; i < 50; i++) {
			var numOfBlocks = Math.random() * 20;
			var inputString = "";
			var expected = "";

			for (var j = 0; j <= numOfBlocks; j++) {
				var prefix = randomString(null, "{");
				var content = randomString(null, "{", "}", "/");
				var suffix = randomString(null, "{");

				inputString += prefix + "{{" + content + "}}" + suffix;
				expected += prefix + content + suffix;
			}

			inputs.push({ input: getInput(inputString), expected });
		}

		startTesting(inputs, done);
	});

	it("should replace a block with only the corresponding value of its content from the mix manifest", done => {
		const inputs = [
			{ input: ["{{/compiledByMix.xml}}"], expected: manifest["/compiledByMix.xml"] },
			{ input: ["{{/sub/compiledByMix3.xml}}"], expected: manifest["/sub/compiledByMix3.xml"] },
			{
				input: ["{{/sub/compiledByMix4.json", "}}"],
				expected: manifest["/sub/compiledByMix4.json"]
			},
			{
				input: ["{{", "/compiledByMix2.json}}"],
				expected: manifest["/compiledByMix2.json"]
			},
			{ input: ["{{/compiledB", "yMix2.json}}"], expected: manifest["/compiledByMix2.json"] },
			{
				input: ["{{/sub/comp", "iledByMix4.json}}"],
				expected: manifest["/sub/compiledByMix4.json"]
			}
		];

		for (let i = 0; i < 50; i++) {
			var numOfBlocks = Math.random() * 20;
			var inputString = "";
			var expected = "";

			for (var j = 0; j <= numOfBlocks; j++) {
				var prefix = randomString(null, "{");
				var content = manifest_keys[Math.floor(Math.random() * manifest_keys.length)];
				var suffix = randomString(null, "{");

				inputString += prefix + "{{" + content + "}}" + suffix;
				expected += prefix + manifest[content] + suffix;
			}

			inputs.push({ input: getInput(inputString), expected });
		}

		startTesting(inputs, done);
	});

	it("should not allow opening a new block before closing the previously opened one", done => {
		const error = new Error("nested double brace syntax is not allowed");

		const inputs = [
			{ input: ["{{compiledByMix.xml{{"], expected: error },
			{ input: ["{{sub/com{{piledByMix3.xml}}"], expected: error },
			{ input: ["{{sub/compiledByMix4.json", "{{"], expected: error },
			{ input: ["{{", "compiledByMix{{2.json}}"], expected: error },
			{ input: ["{{compile}}dB{", "{yM{ix2{{.json}}"], expected: error },
			{ input: ["{{sub/comp", "iledByMix4.json{{"], expected: error }
		];

		for (let i = 0; i < 50; i++) {
			var inputString =
				randomString(null) + "{{" + randomString(null, "}") + "{{" + randomString(null);

			inputs.push({ input: getInput(inputString), expected: error });
		}

		startTesting(inputs, done);
	});
});
