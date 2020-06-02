const mix = require("laravel-mix");
const Plugin = require("./Plugin");

mix.extend("copyAndReplace", new Plugin());
