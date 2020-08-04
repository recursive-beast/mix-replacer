const _ = require("lodash");
const Schema = require("validate");

const schema = new Schema({
	delimiters: {
		left: {
			type: String,
			length: 2
		},
		right: {
			type: String,
			length: 2
		}
	}
});

// Default options.
let options = {
	delimiters: {
		left: "{{",
		right: "}}"
	}
};

/**
 * Merges the new option values to the existing values.
 * @param new_options - An object that represents the new options to be merged.
 */
function merge(new_options) {
	const errors = schema.validate(new_options);

	if (errors.length) {
		// We'll just throw the first error,
		// and let the user correct his object property by property
		// until he gets it right.
		throw errors[0];
	}

	_.merge(options, new_options);
}

module.exports = {
	merge,
	options
};
