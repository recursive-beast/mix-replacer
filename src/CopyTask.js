const fs = require("fs");
const path = require("path");
const pipeline = require("stream").pipeline;
const Transformer = require("./Transformer");

class CopyTask {
	/**
	 * An object representing the task of copying a file from `src` to `target_dir`
	 * while replacing public urls inside double brace syntax with their
	 * corresponding values from the `mix-manifest.json`.
	 *
	 * @param {string} src The source file path.
	 * @param {string} target_dir The target directory.
	 * @param {string} public_path The path for the project's public directory.
	 */
	constructor(src, target_dir, public_path) {
		if (!fs.existsSync(src)) throw new Error(`"${src}" doesn't exist`);

		this.src = src;
		this.public_path = public_path;
		this.running = false;

		target_dir = this.normalizeDir(target_dir);

		const fileName = path.basename(this.src);

		this.target = path.join(target_dir, fileName);
		this.path_from_public = this.target.substring(public_path.length + 1);
	}

	/**
	 * Forces the directory to be inside the public path.
	 * @param {string} dir The directory path.
	 * @returns {string} The normalized directory path.
	 */
	normalizeDir(dir) {
		if (!dir) return this.public_path;

		const segments = dir.split(/\/+|\\+/g);

		if (segments[0] !== this.public_path) {
			segments.unshift(this.public_path);
		}

		return path.join(...segments);
	}

	/**
	 * Ensure that the target directory exists
	 */
	ensureTargetDir() {
		const dir = path.dirname(this.target);
		fs.mkdirSync(dir, {recursive: true});
	}

	/**
	 * Run the task.
	 * @param {Object} manifest The mix manifest object that contains public file paths.
	 * @returns {Promise<string>} A promise for the current task that resolves to the resulting file's path.
	 */
	run(manifest) {
		if (this.running) return this._promise;

		this._promise = new Promise((resolve, reject) => {

			this.ensureTargetDir();

			const target = fs.createWriteStream(this.target);

			const src = fs.createReadStream(this.src, {highWaterMark: 16 * 1024});

			const transformer = new Transformer(manifest);

			pipeline(src, transformer, target, err => {
				this.running = false;

				if (err) {
					reject(new Error(`Error while transforming "${this.src}"\nReason : ${err.message}`));
				} else {
					resolve(this.target);
				}
			});
		});

		return this._promise;
	}
}

module.exports = CopyTask;
