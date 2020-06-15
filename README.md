[![npm](https://img.shields.io/npm/dt/mix-replacer)](https://www.npmjs.com/package/mix-replacer)
[![npm](https://img.shields.io/npm/v/mix-replacer)](https://www.npmjs.com/package/mix-replacer)
[![Build Status](https://travis-ci.com/soufyakoub/mix-replacer.svg?branch=master)](https://travis-ci.com/soufyakoub/mix-replacer)
[![codecov](https://codecov.io/gh/soufyakoub/mix-replacer/branch/master/graph/badge.svg)](https://codecov.io/gh/soufyakoub/mix-replacer)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/soufyakoub/mix-replacer/blob/master/LICENSE)

# mix-replacer

> A [laravel-mix](https://laravel-mix.com/docs/5.0/versioning) extension to copy files
> and append hash queries to public urls.

## Installation

Install this package as a dev dependency:

`npm --save-dev i mix-replacer`

## Usage

from your `webpack.mix.js`, require `mix-replacer`.

This will add a new `copyAndReplace` method that can be used like this:

```js
const mix = require("laravel-mix");
require("mix-replacer");

mix.setPublicPath("public")
   .js("resources/js/index.js", "public/js")
   .sass("resources/scss/index.scss", "public/css")
   .copy("resources/images/*", "public/images")
   .copyAndReplace("resources/config/*", "public");
```

Now after the compilation is done, your public directory will contain your expected files.

Also, for all files matched against the `resources/config/*` pattern,
public URLs inside double braces `{{ }}` will contain hash queries
extracted from the generated `public/mix-manifest.json`.

## Example
 
This:

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="{{/images/logo70.png}}"/>
            <square150x150logo src="{{/images/logo150.png}}"/>
            <square310x310logo src="{{/images/logo310.png}}"/>
            <TileColor>#2483DD</TileColor>
        </tile>
    </msapplication>
</browserconfig>
```

Will be transformed to This: (Of course, your particular hashes will be unique)

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/images/logo70.png?id=2c488484a2545fa0d94f"/>
            <square150x150logo src="/images/logo150.png?id=a97169e69a58920b624d"/>
            <square310x310logo src="/images/logo310.png?id=16938d48f46cc4dfa071"/>
            <TileColor>#2483DD</TileColor>
        </tile>
    </msapplication>
</browserconfig>
```

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and
testing purposes.

### Installation

Install dependencies with: `npm install`

### Running tests

Running tests is as simple as typing `npm run test` in a terminal from the project's root directory.

Coverage reports are generated to `tests/coverage`.

| :warning: make sure your node.js version is `>= 10.14.2`, [here's why](https://github.com/facebook/jest/issues/9538)|
|---|

## Contributing

Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the
[LICENSE](https://github.com/soufyakoub/mix-replacer/blob/master/LICENSE) file for details.
