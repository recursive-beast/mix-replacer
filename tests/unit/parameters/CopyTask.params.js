module.exports = {

	"constructor": [
		// [src, target_dir, expected_target],
		["/file.txt", "/", `${ROOT}file.txt`],
		[`${ROOT}file.txt`, "/sub1/sub2", `${ROOT}sub1${SEP}sub2${SEP}file.txt`],
		[`${SEP}file.txt`, "", `${CWD}${SEP}file.txt`],
		["/file.txt", "sub1/sub2", `${CWD}${SEP}sub1${SEP}sub2${SEP}file.txt`],
		["/sub1/sub2/file.txt", "/", `${ROOT}file.txt`],
		["/sub1/sub2/.file", "/sub1/sub2", `${ROOT}sub1${SEP}sub2${SEP}.file`],
		["/sub1/sub2/file", CWD, `${CWD}${SEP}file`],
		[`${ROOT}sub1${SEP}sub2${SEP}file.txt`, "sub1/sub2", `${CWD}${SEP}sub1${SEP}sub2${SEP}file.txt`],
		["sub1/sub2/file.txt", "/", `${ROOT}file.txt`],
		["./sub1/sub2/.file.txt", "/sub1/sub2", `${ROOT}sub1${SEP}sub2${SEP}.file.txt`],
		["sub1/sub2/file.txt", CWD, `${CWD}${SEP}file.txt`],
		[`./sub1${SEP}sub2${SEP}file.txt`, "sub1/sub2", `${CWD}${SEP}sub1${SEP}sub2${SEP}file.txt`],
		["file.txt", "/", `${ROOT}file.txt`],
		["file.txt", "/sub1/sub2", `${ROOT}sub1${SEP}sub2${SEP}file.txt`],
		["file.txt", CWD, `${CWD}${SEP}file.txt`],
		["file.txt", "sub1/sub2", `${CWD}${SEP}sub1${SEP}sub2${SEP}file.txt`],
	],

};
