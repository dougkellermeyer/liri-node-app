require("dotenv").config();

var needKeys = require("./keys.js");

console.log(needKeys);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//what process.argv do I need to create to enable the "my-tweets" command?
//this should get the path to keys.js correct?, since it is the second argument?
 var tweets = process.argv[2];
 console.log(needKeys.twitter);

 var beats = process.argv[2];
 console.log(needKeys.spotify);

 //do I need to create a URL key like we need in previous activies?
//"https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

//here is my FULL URL with API keyhttp://www.omdbapi.com/?i=tt3896198&apikey=363e99b
//API key is in keys.js, or simply 363e99b
 var movies = process.argv[2];
 console.log(movies);