module.exports = {
	"_flush": [
		// [
		// 	savedData,
		// 	expected_callback_args,
		// ],
		[
			"",
			[],
		],
		[
			"something",
			[null, "something"],
		],
		[
			"{{random-text",
			[null, "{{random-text"],
		],
		[
			"{{",
			[null, "{{"],
		],
		[
			"{",
			[null, "{"],
		],
	],

	"_transform": [
		// [
		// 	savedData,
		// 	chunk,
		// 	expected_callback_args,
		// 	expected_saved_data,
		// ],
		[
			"",
			"",
			[],
			"",
		],
		[
			"",
			"{{}}",
			[],
			"",
		],
		[
			"{{random",
			"",
			[],
			"{{random",
		],
		[
			"",
			"content {{/public/path}} more content",
			[null, "content /public/path?id=hash more content"],
			"",
		],
		[
			"",
			"content {{/public/path}} more {{content",
			[null, "content /public/path?id=hash more "],
			"{{content",
		],
		[
			"",
			"content {{/public/path}} more {{",
			[null, "content /public/path?id=hash more "],
			"{{",
		],
		[
			"",
			"content {{/public/path}} more {",
			[null, "content /public/path?id=hash more "],
			"{",
		],
		[
			"",
			"content {{/public/path}} {{more {{ content",
			[null, "content /public/path?id=hash "],
			"{{more {{ content",
		],
		[
			"",
			"content {{/public/path}} {{more { content",
			[null, "content /public/path?id=hash "],
			"{{more { content",
		],
		[
			"",
			"content {{/public/path}} {{even { more { content",
			[null, "content /public/path?id=hash "],
			"{{even { more { content",
		],
		[
			"",
			"content {{/public/path}} {{even {{/public/path}} more {{ content",
			[null, "content /public/path?id=hash even {{/public/path more "],
			"{{ content",
		],
		[
			"",
			"content {{/no/exist/manifest}} {{ /public/path}} more {{ content",
			[null, "content /no/exist/manifest  /public/path more "],
			"{{ content",
		],
		[
			"",
			"content {{/no/exist/manifest}} {{/public\n/path}} more {{ content",
			[null, "content /no/exist/manifest {{/public\n/path}} more "],
			"{{ content",
		],
		[
			"",
			"content {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path}} more {{ content",
			[null, "content /no/exist/manifest {{/public\n/path}} \t /public/path?id=hash more "],
			"{{ content",
		],
		[
			"{",
			"content {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path}} more {{ content",
			[null, "{content /no/exist/manifest {{/public\n/path}} \t /public/path?id=hash more "],
			"{{ content",
		],
		[
			"{{",
			"content {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path}} more {{ content",
			[null, "content {{/no/exist/manifest {{/public\n/path}} \t /public/path?id=hash more "],
			"{{ content",
		],
		[
			"{{",
			"/public/path2}} {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path}} more {{ content",
			[null, "/public/path2?id=other-hash /no/exist/manifest {{/public\n/path}} \t /public/path?id=hash more "],
			"{{ content",
		],
		[
			"{",
			"{/public/path2}} {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path}} more {{ content",
			[null, "/public/path2?id=other-hash /no/exist/manifest {{/public\n/path}} \t /public/path?id=hash more "],
			"{{ content",
		],
		[
			"{{/publ",
			"ic/path2}} {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path}} more {{ content",
			[null, "/public/path2?id=other-hash /no/exist/manifest {{/public\n/path}} \t /public/path?id=hash more "],
			"{{ content",
		],
	],
};
