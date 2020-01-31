const glob = require("glob");
const mix = require("laravel-mix");
const CopyTask = require("./CopyTask");

var tasks = {};

mix.then(() => {
	const runningTasks = [];

	for (const src in tasks) {
		let task = tasks[src];

		runningTasks.push(task.run());
	}

	Promise.allSettled(runningTasks).then(results => {
		for (const { status, reason } of results) {
			if (status === "rejected") console.log(reason);
		}

		Mix.manifest.refresh();
	});

	tasks = {};
});

mix.extend("copyAndReplace", (_, globPattern, target_dir = "") => {
	const srcPaths = glob.sync(globPattern, { nodir: true });

	for (var src of srcPaths) {
		// if a task that has `src` as its src path is found
		// override its target directory
		// else add a new task

		var task = tasks[src];

		if (task) {
			task.setTargetDir(target_dir);
		} else {
			tasks[src] = new CopyTask(src, target_dir);
		}
	}
});
