const Transform = require("stream").Transform;
const StringDecoder = require("string_decoder").StringDecoder;

module.exports = class Transformer extends Transform {
	constructor(options) {
		super(options);

		this._decoder = new StringDecoder();

		this._savedData = "";
	}

	_flush(callback) {
		var data_to_flush = this._savedData + this._decoder.end();

		if (data_to_flush) callback(null, data_to_flush);
		else callback();
	}

	_transform(chunk, encoding, callback) {
		var chunk = this._decoder.write(chunk);

		if (this._savedData) {
			chunk = this._savedData + chunk;
			this._savedData = "";
		}

		if (!chunk) return callback();

		// when flag is true , it means that a double brace block is open
		var flag = false;
		var lastIndex = -2;
		var result = "";

		const matches = chunk.matchAll(/{{|}}/g);

		for (var { 0: match, index } of matches) {
			if (flag && match === "{{")
				return callback(new Error("nested double brace syntax is not allowed"));

			if ((!flag && match === "{{") || (flag && match === "}}")) {
				var content = chunk.substring(lastIndex + 2, index);

				// if we just matched the closing braces for an already opened block, 
				// replace its content with the corresponding value from the mix manifest if it exists
				result += flag ? Mix.manifest.manifest[content] || content : content;

				flag = !flag;

				lastIndex = index;
			}
		}

		if (flag) {
			this._savedData = chunk.substring(lastIndex);
		} else {
			var end = chunk.length;

			if (chunk[chunk.length - 1] === "{") {
				this._savedData = "{";
				end--;
			}

			result += chunk.substring(lastIndex + 2, end);
		}

		if (result) callback(null, result);
		else callback();
	}
};
