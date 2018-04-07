require("dotenv").config();

var needKeys = require("./keys.js");

console.log(needKeys);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);