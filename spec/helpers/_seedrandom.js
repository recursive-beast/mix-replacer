const seedrandom = require("seedrandom");

var { seed, random } = jasmine.getEnv().configuration();

if (random) throw Error("please disable jasmine's randomisation");

if (seed) {
	// now Math.random() is seeded with `seed`
	seedrandom(seed, { global: true });
} else {
	throw Error("please provide a seed to jasmine");
}
