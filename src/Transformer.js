const Transform = require("stream").Transform;
const StringDecoder = require("string_decoder").StringDecoder;
const {escapeRegExp} = require("./helpers");
const {options} = require("./options");

class Transformer extends Transform {

	constructor(manifest) {
		super();

		const r = escapeRegExp(options.delimiters.right);
		let l = options.delimiters.left;
		const l_0 = escapeRegExp(l[0]);
		const l_1 = escapeRegExp(l[1]);
		l = l_0 + l_1;

		const reg_str = `${l}(.*?)${r}`
		                + "|"
		                + `(${l_0}(?:${l_1}(?:.*)?)?)$`;

		this._regExp = new RegExp(reg_str, "g");
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

		if (!chunk) {
			return callback();
		}

		const result = chunk.replace(
			this._regExp,

			(substring, group1, group2) => {
				if (typeof group2 === "undefined") {
					return this.manifest[group1] || group1;
				} else {
					this._savedData = group2;
					return "";
				}
			},
		);

		if (result) {
			callback(null, result);
		} else {
			callback();
		}

	}
}

module.exports = Transformer;
