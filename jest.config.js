const path = require("path");
const IS_UNIX = path.sep === "/";
const SEP = path.sep;
const ROOT = IS_UNIX ? "/" : "C:\\";
const CWD = path.resolve();

module.exports = {
	verbose: true,
	collectCoverage: true,
	collectCoverageFrom: ["<rootDir>/src/**/*"],
	coverageDirectory: "<rootDir>/tests/coverage",
	testEnvironment: "node",
	testMatch: ["<rootDir>/tests/**/*.test.js"],
	globals: {
		IS_UNIX: IS_UNIX,
		SEP: SEP,
		ROOT: ROOT,
		CWD: CWD,
		NAMESPACE: "97893054-2180-4178-8437-c298642a27eb",
	},
};
