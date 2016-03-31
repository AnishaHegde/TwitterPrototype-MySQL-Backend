
var ejs = require("ejs");
var mysql = require('./mysql');


exports.retrieveAllTweets = function(req,res)
{
	
	var email = req.session.username;
	console.log("Email: " + email);
	var uhandle = req.session.userhandle;
	console.log("Userhandle: " + uhandle);
	
	// check user already exists
	var getTweets = "select * from tweets;";
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
