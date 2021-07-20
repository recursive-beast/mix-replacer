function escapeRegExp(string) {
	if (typeof string !== "string") {
		throw TypeError("Expected a string");
	}

	return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

function merge(defaultOptions, overrideOptions) {
	for (let key in overrideOptions) {
		defaultOptions[key] = overrideOptions[key];
	}
}

module.exports = {
	escapeRegExp,
	merge
};
