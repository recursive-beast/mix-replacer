const glob = require("glob");
const fs = require("fs");
const mix = require("laravel-mix");
const CopyTask = require("./CopyTask");

class CopyAndReplacePlugin {

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

		const newTasks = srcPaths.map(src => new CopyTask(src, target_dir, Config.publicPath));

		this._tasks.push(...newTasks);
	}

	/**
	 * This method is triggered after the
	 * user's webpack.mix.js file has executed.
	 */
	boot() {
		mix.override(webpackConfig => {
			const plugins = webpackConfig.plugins;

			if (plugins)
				plugins.push(this);
			else {
				webpackConfig.plugins = [this];
			}
		});
	}

	apply(compiler) {

		compiler.hooks.done.tapAsync("CopyAndReplacePlugin", (stats, callback) => {
			const tasks = this._tasks.map(task => task.run(Mix.manifest.manifest));

			Promise.all(tasks).then(target_paths => {

				for (const task of this._tasks) {

					const from_public_path = task._target.substring(Config.publicPath.length);

					Mix.manifest.hash(from_public_path);

					// Update the Webpack assets list for better terminal output.
					stats.compilation.assets[from_public_path] = {
						size: () => fs.statSync(task._target).size,
						emitted: true,
					};
				}

				Mix.manifest.refresh();

				callback();
			});
		});
	}
}

module.exports = CopyAndReplacePlugin;
