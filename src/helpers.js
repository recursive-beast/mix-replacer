function escapeRegExp(string) {
	if (typeof string !== "string") {
		throw TypeError("Expected a string");
	}

	return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
	escapeRegExp,
};
