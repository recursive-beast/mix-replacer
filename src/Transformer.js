const Transform = require("stream").Transform;
const StringDecoder = require("string_decoder").StringDecoder;

module.exports = class Transformer extends Transform {
	constructor(options) {
		super(options);

		this.decoder = new StringDecoder();

		this.savedData = "";
	}

	_flush(callback) {
		var data_to_flush = this.savedData + this.decoder.end();

		if (data_to_flush) callback(null, data_to_flush);
		else callback();
	}

	_transform(chunk, encoding, callback) {
		var chunk = this.decoder.write(chunk);

		if (this.savedData) {
			chunk = this.savedData + chunk;
			this.savedData = "";
		}

		if (!chunk) return callback();

		var flag = false;
		var lastIndex = -2;
		var result = "";

		const matches = chunk.matchAll(/{{|}}/g);

		for (var { 0: match, index } of matches) {
			if (flag && match === "{{")
				return callback(new Error("nested double brace syntax is not allowed"));

			if ((!flag && match === "{{") || (flag && match === "}}")) {
				var content = chunk.substring(lastIndex + 2, index);

				result += flag ? Mix.manifest.manifest[content] || content : content;

				flag = !flag;

				lastIndex = index;
			}
		}

		if (flag) {
			this.savedData = chunk.substring(lastIndex);
		} else {
			var end = chunk.length;

			if (chunk[chunk.length - 1] === "{") {
				this.savedData = "{";
				end--;
			}

			result += chunk.substring(lastIndex + 2, end);
		}

		if (result) callback(null, result);
		else callback();
	}
};
