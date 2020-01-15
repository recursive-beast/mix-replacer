const fs = require("fs");
const path = require("path");
module.exports = class CopyTask {
	constructor(src, target_dir = "") {
		if (!fs.existsSync(src)) throw src + " doesn't exist";

		target_dir = this.normalizeDir(target_dir);

		var fileName = path.basename(src);

		this.src = src;

		this.target = path.join(target_dir, fileName);
	}

	/**
	 * prepare the provided directory path for processing
	 * @param {string} dir
	 */
	normalizeDir(dir = "") {
		var segments = dir.split(/\/|\\/g);

		if (segments[0] === Config.publicPath) return dir;

		return path.join(Config.publicPath, ...segments);
	}
};
