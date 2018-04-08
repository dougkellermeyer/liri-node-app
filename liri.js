require("dotenv").config();

//homework completed working with Rob Relief, probably some overlap in code as an FYI

//bring in our keys.js file
var keys = require("./keys.js");
//show that keys.js is being imported correctly 
// console.log(keys);
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var fileArgument = process.argv[2];
var userInput = process.argv[3];

//want to combine a lyrics feature to be added to the spotify results
// var lyrics = require("grab-lyrics");

//access they keys for Spotify and Twitter
var song = new Spotify(keys.spotify);
var twitterUser = new Twitter(keys.twitter);
// console.log(song);
// console.log(twitterUser);

// code so liri can take in the following commands = 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'

//Can use an if statement to write condidtions for each command
//Could also use a switch command
//start with initial switch value

switch (fileArgument) {
    case "my-tweets":
        myTweets(); break;

    case "spotify-this-song":
        spotifyThisSong(); break;

    case "movie-this":
        movieThis(); break;

    case "do-what-it-says":
        doWhatItSays(); break;

    //Prompt the user with instructions as a default message

    default:
        console.log("************* Welcome to LIRI, the Node assistant **************\n" +
            "\nLIRI can look up a song, movie, or Twitter account for you. \n--- Give it a try using one of the options below: ---\n" +
            "================================================================" +
            "\n --> Type 'spotify-this-song' and the song name in quotes, ex. 'Song Name'" +
            "\n --> Type 'movie-this' and the movie name in quotes, ex.'Movie Name'" +
            "\n --> Type 'my-tweets' and the twitter handle name in quotes, ex.'KingJames'" +
            "\n --> Type 'do-what-it-says'\n" +
            "================================================================");
}

//Create Twitter function that grabs the last 10 tweets and when they were written

function myTweets() {
    var twitterUser = new Twitter(keys.twitterKeys);

    var twitterUsername = userInput;
    var text = "text";
    var params = { screen_name: twitterUsername, count: 10 };

    if (!twitterUsername) {
        twitterUsername = "LiriMe2018";
    }
    twitterUser.get("statuses/user_timeline", params, function (error, tweets, response) {

        var responseTweet = "***** LIRI grabbed " + twitterUsername.toUpperCase() + "'s last 10 tweets, check the log.txt file :) *****\n";
        console.log(responseTweet);

        //Need to loop through the users tweet and put them in text file to be stored each time the loop is run
        for (var i = 1; i < tweets.length; i++) {
            var time = tweets[i].created_at;
            var timeArr = time.split(" ");
            var output = "Tweet # " + i + " \n" + tweets[i].text + "\n" + timeArr.slice(0, 4).join("- ") + "\n\n";
            console.log(output);

            fs.appendFile("log.txt", responseTweet + "\n" + output, function (error) {
                if (error) throw error;
                console.log("There was an error :(")
            });
            console.log("Tweets grabbed and saved in log.txt for you!");
        }
    })

}

//Insert spotify function to grab song chosen by user

function spotifyThisSong() {
    var song = new Spotify({
        id: "27a8864ac89a46a0b05ff38922f61f58",
        secret: "6396ce8169954f6c9edf68c72af394ab"
    });

    var songName = userInput;
    var space = "\n" + "\n" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";

    //put default song name if user doesn't enter a valid song
    if (!songName) {
        SongName = "My Way";
        //thought a little Frank would be funny :)
    }

    params = songName;
    song.search({ type: "track", query: params }, function (error2, data) {
        if (error2) {
            console.log("Error getting your song: " + error2);
            return;
        }
        else {
            output = space + "=============== Look what LIRI found for you ==============" + space + "Song Name: " + "'" + songName.toUpperCase() + "'" + space + "Album Name: " + data.tracks.items[0].album.name +
                space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +
                space + "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
            console.log(output);

            fs.appendFile("log.txt", output, function (err) {
                if (err) throw err;
                console.log("Song saved! Check the log.txt file!");
            });
        }
    });
}

//Need to create the movie-this function

function movieThis() {
    var movie = userInput;
    if (!movie) {
        movie = "Caddyshack";
        console.log("It looks like you selected a movie that doesn't exist or you spelled it incorrectly :) May I suggest the golf classic Caddyshack");
    }
    movieName = movie;
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            var space = "\n" + "\n" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
            //console.log(movieObject); // Show the text in the terminal
            var movieResults = " ----------------- LIRI Gathered Movie Data for you ----------------- \n" +
                space + "Title: " + movieObject.Title +
                space + "Year: " + movieObject.Year +
                space + "Imdb Rating: " + movieObject.imdbRating +
                space + "Country: " + movieObject.Country +
                space + "Language: " + movieObject.Language +
                space + "Rotten Tomatoes Rating: " + movieObject.tomatoRating +
                space + "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\n\n\n" +
                space + "***[MORE INFO BELOW]*** \n\n\n" +
                "\nActors: ===> " + movieObject.Actors + "\n" +
                "\nPlot:  ===> " + movieObject.Plot + "\n";

            console.log(movieResults);
            fs.appendFile("log.txt", movieResults, function (error) {
                if (error) throw error;
                console.log("Movie saved!");
            });
            // console.log(movieObject);
        } else {
            console.log("Error :" + error);
            return;
        }
    });
}
//Need to create the function for do-what-it-says user input

var arrayRandom = [];
function doWhatItSays() {

    fs.readFile("random.txt", 'utf8', function (error, data) {
        if (error) throw error;
        // Rob and I found this one on the internet, but hey it works :)
        loggedText = data.split(",");
        console.log(loggedText);

        var command;
        var parameter;

        command = loggedText[0];
        parameter = loggedText[1];

        parameter = parameter.replace('"', '');
        parameter = parameter.replace('"', '');
        // console.log(parameter);

        switch (command) {
            case 'my-tweets':
                userInput = parameter;
                myTweets();
                break;

            case 'spotify-this-song':
                userInput = parameter;
                spotifyThisSong();
                break;

            case 'movie-this':
                userInput = parameter;
                movieThis();
                break;
        }
    });

}

