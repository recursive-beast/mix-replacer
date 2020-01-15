module.exports = class Replacer {
	constructor() {}

	apply(compiler) {
		compiler.hooks.done.tap("Replacer", stats => {});
	}
};
