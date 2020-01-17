const glob = require("glob");
const CopyTask = require("./CopyTask");

module.exports = class Replacer {
	constructor() {
		/** @type {Map<string,CopyTask>} */
		this.tasks = new Map();
	}

	/**
	 * copy all files extracted from `globPattern` to the target directory `target_dir`
	 * @param {string} globPattern
	 * @param {string} target_dir
	 */
	copy(globPattern, target_dir = "") {
		const srcPaths = glob.sync(globPattern, { nodir: true });

		for (var src of srcPaths) {
			// if task with src path same as `src` is found
			// override its target directory
			// else just add a new one

			var task = this.tasks.get(src);

			if (task) task.setTargetDir(target_dir);
			else this.tasks.set(src, new CopyTask(src, target_dir));
		}

		return this;
	}

	apply(compiler) {
		compiler.hooks.done.tap("Replacer", stats => {});
	}
};
