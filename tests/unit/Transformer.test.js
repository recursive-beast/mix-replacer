const Transformer = require("../../src/Transformer");
const params = require("./parameters/Transformer.params");

describe("_flush method", () => {
	test.each(params._flush)(
		"#%#",
		(savedData, expected_callback_args) => {
			const callback = jest.fn();
			const transformer = new Transformer();
			transformer._savedData = savedData;

			transformer._flush(callback);

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(...expected_callback_args);
		},
	);
});

describe("_transform method", () => {
	test.each(params._transform)(
		"#%#",
		(savedData, chunk, expected_callback_args, expected_saved_data) => {
			const callback = jest.fn();
			const manifest = {
				"/public/path": "/public/path?id=hash",
				"/public/path2": "/public/path2?id=other-hash",
			};
			const transformer = new Transformer(manifest);
			transformer._savedData = savedData;

			transformer._transform(Buffer.from(chunk), "utf8", callback);

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(...expected_callback_args);
			expect(transformer._savedData).toBe(expected_saved_data);
		},
	);
});
