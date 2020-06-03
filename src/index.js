const mix = require("laravel-mix");
const CopyAndReplacePlugin = require("./CopyAndReplacePlugin");

mix.extend("copyAndReplace", new CopyAndReplacePlugin());
