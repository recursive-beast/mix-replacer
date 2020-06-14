const {withHashQuery} = require("../../helpers");

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
			"content {{/public/sub/path}} more content",
			[
				null,
				`content ${withHashQuery("/public/sub/path")} more content`,
			],
			"",
		],
		[
			"",
			"content {{/public/sub/path}} more {{content",
			[
				null,
				`content ${withHashQuery("/public/sub/path")} more `,
			],
			"{{content",
		],
		[
			"",
			"content {{/public/path2}} more {{",
			[
				null,
				`content ${withHashQuery("/public/path2")} more `,
			],
			"{{",
		],
		[
			"",
			"content {{/public/sub/path}} more {",
			[
				null,
				`content ${withHashQuery("/public/sub/path")} more `,
			],
			"{",
		],
		[
			"",
			"content {{/public/path2}} {{more {{ content",
			[
				null,
				`content ${withHashQuery("/public/path2")} `,
			],
			"{{more {{ content",
		],
		[
			"",
			"content {{/public/path2}} {{more { content",
			[
				null,
				`content ${withHashQuery("/public/path2")} `,
			],
			"{{more { content",
		],
		[
			"",
			"content {{/path3}} {{even { more { content",
			[
				null,
				`content /path3 `,
			],
			"{{even { more { content",
		],
		[
			"",
			"content {{/public/path2}} {{even {{/public/path2}} more {{ content",
			[
				null,
				`content ${withHashQuery("/public/path2")} even {{/public/path2 more `,
			],
			"{{ content",
		],
		[
			"",
			"content {{/no/exist/manifest}} {{ /path3}} more {{ content",
			[
				null,
				"content /no/exist/manifest  /path3 more ",
			],
			"{{ content",
		],
		[
			"",
			"content {{/no/exist/manifest}} {{/public\n/path2}} more {{ content",
			[
				null,
				"content /no/exist/manifest {{/public\n/path2}} more ",
			],
			"{{ content",
		],
		[
			"",
			"content {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path2}} more {{ content",
			[
				null,
				`content /no/exist/manifest {{/public\n/path}} \t ${withHashQuery("/public/path2")} more `,
			],
			"{{ content",
		],
		[
			"{",
			"content {{/no/exist/manifest}} {{/public\n/path}} \t {{/path3}} more {{ content",
			[
				null,
				`{content /no/exist/manifest {{/public\n/path}} \t /path3 more `,
			],
			"{{ content",
		],
		[
			"{{",
			"content {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/sub/path}} more {{ content",
			[
				null,
				`content {{/no/exist/manifest {{/public\n/path}} \t ${withHashQuery("/public/sub/path")} more `,
			],
			"{{ content",
		],
		[
			"{{",
			"/public/path2}} {{/no/exist/manifest}} {{/public\n/path}} \t {{/path3}} more {{ content",
			[
				null,
				`${withHashQuery("/public/path2")} /no/exist/manifest`
				+ ` {{/public\n/path}} \t /path3 more `,
			],
			"{{ content",
		],
		[
			"{",
			"{/public/path2}} {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/path2}} more {{ content",
			[
				null,
				`${withHashQuery("/public/path2")} /no/exist/manifest`
				+ ` {{/public\n/path}} \t ${withHashQuery("/public/path2")} more `,
			],
			"{{ content",
		],
		[
			"{{/publ",
			"ic/path2}} {{/no/exist/manifest}} {{/public\n/path}} \t {{/public/sub/path}} more {{ content",
			[
				null,
				`${withHashQuery("/public/path2")} /no/exist/manifest`
				+ ` {{/public\n/path}} \t ${withHashQuery("/public/sub/path")} more `,
			],
			"{{ content",
		],
	],
};
