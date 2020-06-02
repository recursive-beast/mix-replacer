const glob = require("glob");
const mix = require("laravel-mix");
const CopyTask = require("./CopyTask");

var tasks = {};

class Plugin {
	apply(compiler) {
		compiler.hooks.done.tap("Plugin", () => {
			const runningTasks = [];

			for (const src in tasks) {
				let task = tasks[src];

				runningTasks.push(task.run());
			}

			Promise.allSettled(runningTasks).then(results => {
				for (const {status, reason} of results) {
					if (status === "rejected") console.log(reason);
				}

				Mix.manifest.refresh();
			});

			tasks = {};
		});
	}
}

mix.extend("copyAndReplace", (_, globPattern, target_dir = "") => {
	const srcPaths = glob.sync(globPattern, {nodir: true});

	if (!srcPaths.length) throw new Error(`"${globPattern}" didn't yield any results`);

	for (var src of srcPaths) {
		var task = tasks[src];

		if (task) {
			task.setTargetDir(target_dir);
		} else {
			tasks[src] = new CopyTask(src, target_dir);
		}
	}
});
