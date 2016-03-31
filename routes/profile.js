/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var mysql = require('./mysql');

// Generate Random Ids to insert as Tweet Id in database
function IDGenerator() {
	 
	 this.length = 8;
	 this.timestamp =+ new Date;
	 
	 var _getRandomInt = function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	 };
	 
	 this.generate = function() {
		 var ts = this.timestamp.toString();
		 var parts = ts.split( "" ).reverse();
		 var id = "";
		 
		 for( var i = 0; i < this.length; ++i ) {
			var index = _getRandomInt( 0, parts.length - 1 );
			id += parts[index];	 
		 }
		 
		 return id;
	 };	 
}


//Render a route to dashboard
exports.routeDashboard = function(req,res)
{
	console.log("Route made to dashboard page...");
	res.send({"statusCode":"200"});
};

// Render dashboard
exports.dashboard = function(req,res)
{
	console.log("Render dashboard page...");
	res.render('twitterdashboard');
};


// Insert Tweets in Database
exports.insertTweet = function(req, res)
{
	var userId, tweetTextId, tweetData, hashtags, hashtagData, isCreator, currentDate;
	
	userId = req.session.username;
	var generator = new IDGenerator();
	tweetTextId = generator.generate();
	tweetData = req.param("tweetText");
	hashtags = req.param("hashTagList");
	isCreator = 1;
	currentDate = new Date().toUTCString();
	
	if(hashtags.length !== 0)
	{
		hashtagData = "";
		
		for(var i=0; i<hashtags.length; i++){
			hashtagData = hashtagData + hashtags[i];}
	}
	else
	{
		hashtagData  = "null";
	}
	
	
	// Insert Tweet
	var insertTweet = "INSERT INTO tweets (`email`, `tweetId`, `tweetData`, `hashtagData`, `isCreator`, `currentTimestamp`) " +
	"VALUES ('" + userId + "','" + tweetTextId + "','" + tweetData + "','" + hashtagData + "','" +	isCreator + "','" +	currentDate + "');";
	
	console.log("Query is:" + insertTweet);
	
	mysql.fetchData(function(err, results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Render profile page after inserting tweets...");
			res.send({"statusCode":"200"});
		}  
	},insertTweet);
	
};


exports.retrieveTweet = function(req,res)
{
	
	var email = req.session.username;
	console.log("Email: " + email);
	var uhandle = req.session.userhandle;
	console.log("Userhandle: " + uhandle);
	
	// check user already exists
	var getTweets = "select * from tweets where email='" + email + "' and isCreator='1';";
	console.log("Get Tweets query is:" + getTweets);
	
	
	mysql.fetchData(function(err, results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Tweets retrieved");
				
				var rows = results;
				console.log(rows[0].tweetData);
				res.send({'tweetData' : rows, 'userHandle' : uhandle});
				
			}
			else {    
				console.log("No tweets found in database");
				res.send({"statusCode":"200"});
			}
		}  
	},getTweets);
};
