module.exports = class ChunkTransformer {
	constructor() {
		this.MAX = 0;

		this.refreshMAX();
	}

	refreshMAX() {
		for (var key in Mix.manifest.manifest) {
			if (key.length > this.MAX) this.MAX = key.length;
		}
	}
};
