const path = require("path");
const os = require("os");
const fs = require("fs");
const uuid = require("uuid");

//------------------ **Warning** ------------------//
//-- Don't use these functions outside of tests --//
//-----------------------------------------------//

/**
 * Go back from the current directory by The specified number of levels.
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

/**
 * Returns the path to a freshly created temporary directory.
 * @returns {string} The temporary directory's path.
 */
function getTempDir() {
	const dir_path = path.join(
		os.tmpdir(),
		"mix-replacer",
		uuid.v4().replace(/-/g, "").substring(0, 6),
	);
	
	fs.mkdirSync(dir_path, {recursive: true});
	
	return dir_path;
}

/**
 * Appends a reproducible hash query to the given url.
 * @param url {string}
 */
function withHashQuery(url) {
	const hash = uuid.v5(url, NAMESPACE)
	                 .replace(/-/g, "")
	                 .substring(0, 20);

	return `${url}?id=${hash}`;
}

module.exports = {
	cdBack,
	getTempDir,
	withHashQuery,
};
