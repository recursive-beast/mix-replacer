const Transform = require("stream").Transform;
const StringDecoder = require("string_decoder").StringDecoder;

class Transformer extends Transform {

	constructor(manifest, options) {
		super(options);

		this.manifest = manifest;
		this._decoder = new StringDecoder();
		this._savedData = "";
	}

	_flush(callback) {
		const data_to_flush = this._savedData + this._decoder.end();

		if (data_to_flush) {
			callback(null, data_to_flush);
		} else {
			callback();
		}
	}

	_transform(chunk, encoding, callback) {
		chunk = this._decoder.write(chunk);

		if (this._savedData) {
			chunk = this._savedData + chunk;
			this._savedData = "";
		}

		if (!chunk) return callback();

		// When flag is true , it means that a double brace block is open
		let flag = false;
		let lastIndex = -2;
		let result = "";

		const matches = chunk.matchAll(/{{|}}/g);

		for (const {0: match, index} of matches) {

			if (flag && match === "{{") {
				return callback(new Error("nested double brace syntax is not allowed"));
			}

			if ((!flag && match === "{{") || (flag && match === "}}")) {
				const content = chunk.substring(lastIndex + 2, index);

				// If we just matched the closing braces for an already opened block, 
				// replace its content with the corresponding value from the mix manifest if it exists
				result += flag ? this.manifest[content] || content : content;

				flag = !flag;

				lastIndex = index;
			}
		}

		if (flag) {
			this._savedData = chunk.substring(lastIndex);
		} else {
			let end = chunk.length;

			if (chunk[chunk.length - 1] === "{") {
				this._savedData = "{";
				end--;
			}

			result += chunk.substring(lastIndex + 2, end);
		}

		if (result) {
			callback(null, result);
		} else {
			callback();
		}
	}
}

module.exports = Transformer;
