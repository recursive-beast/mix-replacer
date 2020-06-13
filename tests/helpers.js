const path = require("path");

/**
 * Go back from the current directory by The specified number of levels.
 *
 * **Warning**: Don't use this function outside of tests.
 * @param levels {int} The number of levels.
 * @param trailing_slash {boolean} True if the result should contain a trailing slash.
 */
function cdBack(levels = 1, trailing_slash = false) {
	let cwd = CWD;

	for (let i = 0; i < levels; i++) {
		cwd = path.dirname(cwd);

		if (cwd === ROOT) {
			return cwd;
		}
	}

	return trailing_slash ? cwd + SEP : cwd;
}

module.exports = {
	cdBack,
};
