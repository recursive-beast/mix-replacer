const fs = require("fs");
const path = require("path");
const Transform = require("stream").Transform;
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
		if (!fs.existsSync(src)) throw src + " doesn't exist";

		this.src = src;

		this.promise = null;

		this.setTargetDir(target_dir);
	}

	/**
	 * prepare the provided directory path for processing
	 * @param {string} dir
	 */
	normalizeDir(dir = "") {
		var segments = dir.split(/\/|\\|\.\./g);

		if (segments[0] === Config.publicPath) return dir;

		return path.join(Config.publicPath, ...segments);
	}

	/**
	 * set the target directory where the source file is gonna be copied into
	 * @param {string} dir
	 */
	setTargetDir(dir = "") {
		if (!this.promise) {
			dir = this.normalizeDir(dir);

			var fileName = path.basename(this.src);

			this.target = path.join(dir, fileName);
		}

		return this.target;
	}

	/**
	 * ensure that the target directory exists
	 */
	ensureTargetDir() {
		const dir = path.dirname(this.target);
		fs.mkdirSync(dir, { recursive: true });
	}

	/**
	 * returns a promise for the current task that resolves to the resulting file's path .
	 * @returns {Promise<string>}
	 */
	run() {
		if (this.promise) return this.promise;

		return new Promise(resolve => {
			this.ensureTargetDir();

			const target = fs.createWriteStream(this.target);

			const src = fs.createReadStream(this.src, { highWaterMark: 1 });

			const transformer = new Transformer();

			const transform = new Transform({
				transform(chunk, encoding, callback) {
					callback(null, transformer.transform(chunk));
				},

				flush(callback) {
					callback(null, transformer.flush());
				}
			});

			src.pipe(transform)
				.pipe(target)
				.on("finish", () => {
					Mix.manifest.hash(this.target.substring(Config.publicPath.length));

					this.promise = null;

					resolve(this.target);
				});
		});
	}
};
