//To include a module, use the require() function with the name of the module
// code to read and set any environment variables with the dotenv package:
require("dotenv").config();

// Add the code required to import the `keys.js` file and store it in a variable
// fs is a core Node package for reading and writing files
var fs = require('fs');
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var liriArgument = process.argv[2];
var userINPUT = process.argv[3];

//prove that I can access my keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// console.log(spotify);
// console.log(client);

// code so liri can take in the following commands = 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'
//perfect time to try a switch statement, which is faster than a if statement. A switch statement starts with a variable called the switch value. Then, each case indicates a possible action based on the given condition.
switch(liriArgument) {
    case "my-tweets": 
        myTweets(); break;

    case "spotify-this-song": 
        spotifyThisSong(); break;

    case "movie-this": 
        movieThis(); break;

    case "do-what-it-says":
        doWhatItSays(); break;

    // Instructions displayed in terminal to the user
    default: console.log("=========== Wassup It's LIRI choose one of the following options : ==============\n" + 
        "\n OPTION: 1. my-tweets 'any twitter name' " +
        "\n OPTION: 2. spotify-this-song 'any song name' "+
        "\n OPTION: 3. movie-this 'any movie name' "+
        "\n OPTION: 4. do-what-it-says."+ "\n\n" +
        "\n**********\nBe sure to put the movie or song name in quotation \nmarks if it's more than one word.\n**********\n\n\n");
}

//-----------------------------------------------------------------------------------------------------------------------------
// Movie function, OMDB api
function movieThis(){
    var movie = userINPUT;
    if(!movie){
        movie = "Black Panther";
    }
    movieName = movie;
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            var space = "\n" + "\n" +"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
            //console.log(movieObject); // Show the text in the terminal
            var movieResults = " ----------------- LIRI Gathered Movie Data for you ----------------- \n" + 
            space + "Title: " + movieObject.Title + 
            space + "Year: " + movieObject.Year + 
            space + "Imdb Rating: " + movieObject.imdbRating+ 
            space + "Country: " + movieObject.Country + 
            space + "Language: " + movieObject.Language +
            space + "Rotten Tomatoes Rating: " + movieObject.tomatoRating + 
            space + "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\n\n\n" + 
            space + "***[MORE INFO BELOW]*** \n\n\n" + 
            "\nActors: ===> " + movieObject.Actors + "\n" +
            "\nPlot:  ===> " + movieObject.Plot + "\n" +
            "\n----------------WHO NEEDS OMDB WHEN YOU GOT LIRI-------------------------" + "\n" + "\n";
            
            console.log(movieResults);
            fs.appendFile("log.txt", movieResults, function (error) {
              if (error) throw error;
              console.log("Movie saved!");
            });
            // console.log(movieObject);
        } else {
            console.log("Error :"+ error);
            return;
        }
    });
}

	//-----------------------------TWITTER FUNCTIONALITY---------------------------------------------------------------------------------------
	// Tweet function, Twitter api --> This will show your last 20 tweets and when they were created at in your terminal/bash window
	function myTweets() { 
		var client = new twitter(keys.twitterKeys);
		 
		var twitterUsername = userINPUT;
		var text = "text";
		var params = {screen_name: twitterUsername, count: 20};
		if(!twitterUsername){
			twitterUsername = "LfaLeg";
		}
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		  	
		  	var divider = " ================= LIRI PULLED " + twitterUsername.toUpperCase() +  "'S LAST 20 TWEETS...================\n\n";
		  	console.log(divider);
		  	for (var i = 1; i < tweets.length; i++) {
		  		var time = tweets[i].created_at;
		  		var timeArr = time.split(' ');
		  		var output = "------------------- Tweet # "+  i  + " --------------\n" + 
		  		tweets[i].text + "\n" +
		  		timeArr.slice(0,4).join('- ') + "\n\n\n";
		  		
		  		console.log(output);
		  		fs.appendFile("log.txt", divider + "\n" + output, function (error) {
		  		  if (error) throw error;
		  		  // console.log('Saved! check log.txt :)');
		  		});		  		
		  	}
		  	console.log('Tweets Saved! check log.txt :)');	
		  }
		  console.log(error);
		});	
	}

// -----------------------------------------------------SPOTIFY FUNCTIONALITY--------------------------------------------------
	// Spotify function, Spotify api ---> will show song data when prompted
	function spotifyThisSong() {
		var spotify = new Spotify({
			id: '27a8864ac89a46a0b05ff38922f61f58',
			secret: '6396ce8169954f6c9edf68c72af394ab'
		});
		var songName = userINPUT;
		var space = "\n" + "\n" +"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
		if(!songName){
			SongName = "What's my age again";
		}

		params = songName;
		spotify.search({ type: 'track', query: params }, function(err, data) {
			if ( err ) {
			    console.log('Error occurred: ' + err);
			    return;  
			}
			else{
				output = space + "================= USER, USER LOOK WHAT LIRI FOUND ==================" + 
				space + "Song Name: " + "'" +songName.toUpperCase()+ "'" +
				space + "Album Name: " + data.tracks.items[0].album.name +
				space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +	
				space + "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
				console.log(output);
					
					fs.appendFile("log.txt", output, function (err) {
					  if (err) throw err;
					  console.log('Saved!');
					});		
				}
		});
		  
	}
	// ------------------------------------------------do-What-IT-Says FUNCTION------------------------------------------------
	// doWhatItSays function--> Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands
	var array_this = [];
	function doWhatItSays() {
		
		fs.readFile("random.txt", 'utf8' ,function(error, data) {
			if (error) throw error;
			// a = data.split(','); ---> found this gem on the world wide web
			loggedTxt = data.split(',');
			console.log(loggedTxt);

			var command;
			var parameter;

			command = loggedTxt[0];
			parameter = loggedTxt[1];

			parameter = parameter.replace('"', '');
			parameter = parameter.replace('"', '');
			// console.log(parameter);

			switch (command) {
			   case 'my-tweets':
			       userINPUT = parameter;
			       myTweets();
			       break;

			   case 'spotify-this-song':
			       userINPUT = parameter;
			       spotifyThisSong();
			       break;

			   case 'movie-this':
			       userINPUT = parameter;
			       movieThis();
			       break;
			}
		});

	}

    // PUT A FORK IT ME BRUH, I'M DONE!!!!!!!!