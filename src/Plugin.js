const glob = require("glob");
const mix = require("laravel-mix");
const CopyTask = require("./CopyTask");

class Plugin {

	constructor() {
		this._tasks = [];
	}

	/**
	 * @param {string} globPattern
	 * @param {string} target_dir
	 */
	register(globPattern, target_dir = "") {
		const srcPaths = glob.sync(globPattern, {nodir: true});

		if (!srcPaths.length) throw new Error(`"${globPattern}" didn't yield any results`);

		let newTasks = srcPaths.map(src => new CopyTask(src, target_dir));

		this._tasks.push(...newTasks);
	}

	/**
	 * This method is triggered after the
	 * user's webpack.mix.js file has executed.
	 */
	boot() {
		mix.webpackConfig({plugins: [this]});
	}

	apply(compiler) {

		compiler.hooks.done.tap("Plugin", (stats) => {
			const tasks = this._tasks.map(task => task.run());

			Promise.all(tasks).then(target_paths => {
				
				for (const task of this._tasks) {

					const from_public_path = task._target.substring(Config.publicPath.length);

					Mix.manifest.hash(from_public_path);
				}

				Mix.manifest.refresh();
			});
		});
	}
}

module.exports = Plugin;
