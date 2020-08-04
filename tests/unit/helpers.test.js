const params = require("./parameters/helpers.params");
const {escapeRegExp} = require("../../src/helpers");

describe("escapeRegExp function", () => {
	describe("Normal Flow", () => {
		test.each(params.escapeRegExp)(
			"#%#",
			(string, expected_string) => {
				expect(escapeRegExp(string)).toBe(expected_string);
			}
		);
	});

	test("Throws Error", () => {
		expect(() => {
			escapeRegExp({});
		}).toThrow(/expected a string/gi);
	});
});
