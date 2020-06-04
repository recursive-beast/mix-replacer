const glob = require("glob");
const fs = require("fs");
const mix = require("laravel-mix");
const CopyTask = require("./CopyTask");

class CopyAndReplacePlugin {

	constructor() {
		this.tasks = [];
	}

	/**
	 * Register new tasks based on the provided glob pattern.
	 *
	 * Called when the user uses this extension in the `webpack.mix.js`.
	 *
	 * @param {string} pattern A shell glob pattern, or just a path to a source file.
	 * @param {string} target_dir The target directory path.
	 */
	register(pattern, target_dir = "") {
		const srcPaths = glob.sync(pattern, {nodir: true});

		if (!srcPaths.length) throw new Error(`"${pattern}" didn't yield any results`);

		const newTasks = srcPaths.map(src => new CopyTask(src, target_dir, Config.publicPath));

		this.tasks.push(...newTasks);
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
			const taskPromises = this.tasks.map(task => task.run(Mix.manifest.manifest));

			Promise.all(taskPromises).then(target_paths => {

				for (const {target, path_from_public} of this.tasks) {

					// Check if the user requested hash versioning
					if (Mix.components.get("version")) {
						Mix.manifest.hash(path_from_public);
					} else {
						Mix.manifest.add(path_from_public);
					}

					// Update the Webpack assets list for better terminal output.
					const resource_path = Mix.manifest.normalizePath(path_from_public);
					stats.compilation.assets[resource_path] = {
						size: () => fs.statSync(target).size,
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
