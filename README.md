[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# Mix-replacer

A [laravel-mix](https://github.com/JeffreyWay/laravel-mix) extension that copies files while replacing public urls with their corresponding values from the `mix-manifest.json` .

## Introduction

Some times you may want to make some configuration files public ( browsersync.xml, manifest.json ... ), and they might contain urls for other public assets ( images, icons ... ), but the problem is that you'll need to add a hash as a query parameter to these public urls for cache busting purposes ( in blade templates in laravel projects, this is done by using the mix() function ), doing this manually is painful, especially for large configuration files . This is where `mix-replacer` comes in .

## Installation

Install this package as a devDependency :

`npm --save-dev i mix-replacer`

## Usage

After installing this package and then requiring it from your `webpack.mix.js` file, a new method called `copyAndReplace` is gonna be available through the mix api :

```javascript
// require order doesn't matter here
const mix = require("laravel-mix");
require("mix-replacer");

mix.js("resources/js/app.js", "public/js")
	.sass("resources/sass/app.scss", "public/css")
	.copyAndReplace("resources/configFiles/browsersync.xml", "public/configFiles")
	// you can use it with a glob pattern too
	.copyAndReplace("resources/configFiles/*.json", "public/configFiles");
```

-   The first parameter is either a file path or a [glob pattern](https://github.com/isaacs/node-glob#readme) for source files .
-   The second parameter is the target directory inside the public path that the source files are gonna be copied into . ( it defaults to the public path used by the mix api)

Now to the fun part, all you have to do is to surround you public urls with double brace syntax ( example `"{{/public/url/here}}"` ), and when you compile your assets using `npm run dev` or `npm run prod` the extension is gonna do its magic .

## Example

Let's assume this is your `webpack.mix.js` file :

```javascript
const mix = require("laravel-mix");
require("mix-replacer");

mix.setPublicPath("public")
	.copy("resources/assets/compiledByMix.xml", "public")
	.copy("resources/assets/compiledByMix2.json", "public")
	.copy("resources/assets/sub/compiledByMix3.xml", "public")
	.copy("resources/assets/sub/compiledByMix4.json", "public")
	.copyAndReplace("resources/configFiles/src1.xml", "public");
```

And the content of `resources/configFiles/src1.xml` is :

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="{{/compiledByMix.xml}}"/>
            <square150x150logo src="{{/sub/compiledByMix3.xml}}"/>
            <square310x310logo src="{{/notCompiledByMix.xml}}"/>
            <TileColor>#2483DD</TileColor>
        </tile>
    </msapplication>
</browserconfig>
```

Now after you run `npm run prod` and the compilation is done, your public directory will contain the 5 files you copied, and the content of `public/src1.xml` will be :

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/compiledByMix.xml?id=dea9e98536d837de68fb"/>
            <square150x150logo src="/sub/compiledByMix3.xml?id=839319469771b9c831ed"/>
            <square310x310logo src="/notCompiledByMix.xml"/>
            <TileColor>#2483DD</TileColor>
        </tile>
    </msapplication>
</browserconfig>
```

Oh and don't forget about the generated `public/mix-manifest.json` ;

```json
{
	"/compiledByMix.xml": "/compiledByMix.xml?id=dea9e98536d837de68fb",
	"/compiledByMix2.json": "/compiledByMix2.json?id=cb5269e255dd5926f863",
	"/sub/compiledByMix3.xml": "/sub/compiledByMix3.xml?id=839319469771b9c831ed",
	"/sub/compiledByMix4.json": "/sub/compiledByMix4.json?id=913e067a162e99e34741",
	"/src1.xml": "/src1.xml?id=ca86c548265ae49236dc"
}
```

## Tests

First of all, install the devDependencies by running `npm install` .

All tests are using the [jasmine testing framework](https://github.com/jasmine/jasmine#readme) .

Some tests are using random string inputs, so in order to reproduce any failures that could happen while testing the specs, a seeded random number generator is needed ( see what i did there ? :upside_down_face: ), that's where [seedrandom](https://github.com/davidbau/seedrandom#cjs--nodejs-usage) comes in, so you'll have to be aware that Math.random() is not the same as the original one .

If you take a peek into the `package.json` file and go straight for the `test` script, you'll notice that there's a seed argument wich you can change to seed the random number generator .

And to run the tests you just run `npm run test` or `npx jasmine --seed=your_seed_here` with a seed of your choice .

## Contributing

A pull request is welcome any time .

## License

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[MIT license](https://opensource.org/licenses/MIT)
