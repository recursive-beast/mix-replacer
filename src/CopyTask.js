const fs = require("fs");
const path = require("path");
const Transformer = require("./Transformer");

module.exports = class CopyTask {
	/**
	 * an object representing the task of copying a file from `src` to `target_dir`
	 * while replacing public urls with their
	 * corresponding values from laravel's mix-manifest.json
	 * @param {string} src the source file path
	 * @param {string} target_dir the directory path that the file is gonna be copied into
	 */
	constructor(src, target_dir = "") {
		if (!fs.existsSync(src)) throw new Error(`"${src}" doesn't exist`);

		this.src = src;

		this.running = false;

		this.setTargetDir(target_dir);
	}

	/**
	 * prepare the provided directory path for processing
	 * @param {string} dir
	 */
	normalizeDir(dir) {
		if (!dir) return Config.publicPath;

		var segments = dir.split(/\/+|\\+/g);

		if (segments[segments.length - 1].includes(".")) segments.pop();

		for (let i = 0; i < segments.length; i++) {
			segments[i] = segments[i].replace(/\.+/g, "");
		}

		dir = path.join(...segments);

		if (dir.startsWith(Config.publicPath)) return dir;

		return path.join(Config.publicPath, dir);
	}

	/**
	 * set the target directory where the source file is gonna be copied into
	 * @param {string} dir
	 */
	setTargetDir(dir = "") {
		if (this.running) return;

		dir = this.normalizeDir(dir);

		var fileName = path.basename(this.src);

		this.target = path.join(dir, fileName);
	}

	/**
	 * ensure that the target directory exists
	 */
	ensureTargetDir() {
		const dir = path.dirname(this.target);
		fs.mkdirSync(dir, { recursive: true });
	}

	/**
	 * @returns {Promise<string>} a promise for the current task that resolves to the resulting file's path .
	 */
	run() {
		if (this.running) return;

		return new Promise(resolve => {
			this.ensureTargetDir();

			const target = fs.createWriteStream(this.target);

			const src = fs.createReadStream(this.src, { highWaterMark: 1 });

			const transformer = new Transformer();

			src.pipe(transformer)
				.pipe(target)
				.on("finish", () => {
					Mix.manifest.hash(this.target.substring(Config.publicPath.length));

					this.running = false;

					resolve(this.target);
				});
		});
	}
};
