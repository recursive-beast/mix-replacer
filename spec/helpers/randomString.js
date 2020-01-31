const chars =
	"'\" !#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]\\^_`abcdefghijklmnopqrstuvwxyz{|}~\t\n\r";

/**
 * get a random string using these characters :
 *
 *```
 * "\'\" !#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]\\^_`abcdefghijklmnopqrstuvwxyz{|}~\t\n\r"
 *```
 * @param {number} length the length of the result string
 *
 * if it can't be parsed to an int then it defaults to a random value between 0 and 612
 * @param {string[]} excludes characters excluded from the result string
 */

module.exports = function randomString(length, ...excludes) {
	length = parseInt(length);

	if (Number.isNaN(length)) length = Math.random() * 611;

	// setting the excludes as properties instead of array values
	// for constant time access
	const excludesMap = {};
	for (const exclude of excludes) excludesMap[exclude] = true;

	var counter = 0;
	var result = "";

	while (counter++ < length) {
		var index = Math.floor(Math.random() * chars.length);

		if (excludesMap[chars[index]]) {
			counter--;
		} else {
			result += chars[index];
		}
	}

	return result;
};
