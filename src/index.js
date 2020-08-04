const mix = require("laravel-mix");
const CopyAndReplacePlugin = require("./CopyAndReplacePlugin");

/**
 * Copy a file and replace public urls inside double brace syntax with their
 * corresponding values from the `mix-manifest.json`.
 * @param {string} pattern A shell glob pattern, or just a path to a source file.
 * @param {string} target_dir The target directory inside the public path.
 */
mix.extend("copyAndReplace", new CopyAndReplacePlugin());

module.exports = {
	options: require("./options").merge,
};
