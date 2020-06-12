const fs = require("fs");
const pipeline = require("stream").pipeline;
const Transformer = require("./Transformer");
const Path = require("./Path");

/**
 * An object representing the task of copying a file from `src` to `target_dir`
 * while replacing public urls inside double brace syntax with their
 * corresponding values from the `mix-manifest.json`.
 */
class CopyTask {

	/**
	 * @param {string|Path} src The source file path.
	 * @param {string|Path} target_dir The target directory path.
	 */
	constructor(src, target_dir) {
		this.src = new Path(src);
		this.target_dir = new Path(target_dir);

		if (!this.src.basename) {
			throw Error(`${src} is not a file path`);
		}

		this.target = this.target_dir.join(this.src.basename);
	}

	/**
	 * Ensure that the target directory exists.
	 */
	ensureTargetDir() {
		fs.mkdirSync(this.target_dir.toString(), {recursive: true});
	}

	/**
	 * Run the task.
	 * @param {Object} manifest The mix manifest object that contains public file paths.
	 * @returns {Promise<Path>} A promise for the current task that resolves to the resulting file's path.
	 */
	run(manifest) {
		if (this.promise) return this.promise;

		this.ensureTargetDir();

		this.promise = new Promise((resolve, reject) => {

			const src = fs.createReadStream(this.src.toString(), {highWaterMark: 16 * 1024});

			const target = fs.createWriteStream(this.target.toString());

			const transformer = new Transformer(manifest);

			pipeline(src, transformer, target, err => {
				if (err) {
					reject(new Error(`Error while transforming "${this.src}"\nReason: ${err}`));
				} else {
					resolve(this.target);
				}
			});
		});

		return this.promise;
	}
}

module.exports = CopyTask;
