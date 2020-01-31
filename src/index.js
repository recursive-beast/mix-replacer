const glob = require("glob");
const CopyTask = require("./CopyTask");

module.exports = class Replacer {
	constructor() {
		/** @type {Object<string,CopyTask>} */
		this._tasks = {};
	}

	/**
	 * copy all files extracted from `globPattern` to the target directory `target_dir`
	 * @param {string} globPattern
	 * @param {string} target_dir
	 */
	copy(globPattern, target_dir = "") {
		const srcPaths = glob.sync(globPattern, { nodir: true });

		for (var src of srcPaths) {
			// if a task that has `src` as its src path is found
			// override its target directory
			// else add a new task

			var task = this._tasks[src];

			if (task) {
				task.setTargetDir(target_dir);
			} else {
				this._tasks.set[src] = new CopyTask(src, target_dir);
			}
		}

		return this;
	}

	apply(compiler) {
		compiler.hooks.done.tap("Replacer", () => {
			const runningTasks = [];

			for (const src in this._tasks) {
				let task = this._tasks[src];

				runningTasks.push(task.run());
			}

			Promise.allSettled(runningTasks).then(results => {
				for (const { status, reason } of results) {
					if (status === "rejected") console.log(reason);
				}

				Mix.manifest.refresh();
			});

			this._tasks = {};
		});
	}
};
