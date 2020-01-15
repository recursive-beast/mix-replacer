const fs = require("fs");
const path = require("path");
module.exports = class CopyTask {
	constructor(src, target_dir = "") {
		if (!fs.existsSync(src)) throw src + " doesn't exist";

		if (Config.publicPath && !target_dir.startsWith(Config.publicPath))
			target_dir = path.join(Config.publicPath, target_dir);

		var fileName = path.basename(src);

		this.src = src;

		this.target = path.join(target_dir, fileName);
	}
};
