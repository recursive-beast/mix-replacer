module.exports = class Transformer {
	constructor() {
		this.MAX = 0;

		this.refreshMAX();

		this.buffer = Buffer.allocUnsafe(this.MAX);

		this.cursor = -1;
	}

	refreshMAX() {
		for (var key in Mix.manifest.manifest) {
			if (key.length > this.MAX) this.MAX = key.length;
		}
	}

	/**
	 * get the collected data from the internal buffer
	 */
	flush() {
		const flushed = Buffer.allocUnsafe(this.cursor + 1);

		if (flushed.length) this.buffer.copy(flushed, 0, 0, this.cursor + 1);

		this.cursor = -1;

		return flushed;
	}

	/**
	 * get the transformation made to the provided `chunk`
	 * @param {Buffer} chunk
	 */
	transform(chunk) {
		// when cursor is `>= 0` that means we're currently collecting new chunks in the buffer
		if (this.cursor >= 0) {
			this.buffer[++this.cursor] = chunk[0];

			const key = this.buffer.toString("utf8", 0, this.cursor + 1);

			const hashed_url = Mix.manifest.manifest[key];

			// hashed url found
			// return it as a buffer
			// and stop collecting new chunks until we encounter a new "/"
			if (hashed_url) {
				this.cursor = -1;
				return Buffer.from(hashed_url);
			}

			// no hashed url found
			// max lengh of a mix-manifest key string reached
			// so we flush what we collected so far
			// and we stop collecting chunks
			if (this.cursor === this.MAX - 1) return this.flush();

			// return an empty buffer
			// and keep collecting new chunks
			return Buffer.allocUnsafe(0);
		}

		// new "/" encountered
		// start collecting new chunks
		if (chunk[0] === 0x2f) {
			this.buffer[++this.cursor] = 0x2f;
			return Buffer.allocUnsafe(0);
		}

		// no new "/" encountered
		return chunk;
	}
};
