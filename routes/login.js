/**
 * Routes file for Login
 */

var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
	
//Redirects to the log in page
exports.redirectToLogin = function(req,res)
{
	console.log("Redirect made to login page...");
	res.send({status:"200"});
};

exports.login = function(req,res)
{
	console.log("Render login page...");
	res.render('login');
};

//Redirects to the log in page
exports.redirectToSignUp = function(req,res)
{
	console.log("Redirect made to signup page...");
	res.send({status:"200"});
};

exports.signup = function(req,res)
{
	console.log("Render signup page...");
	res.render('signup');
};


//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checklogin = function(req,res)
{
	var email, password;
	email = req.param("username");
	password = req.param("password");
	
	
	// check user already exists
	var getUser="select * from users where email='" + email + "' and password='" + password +"'";
	console.log("Query is:" + getUser);
	
	
	mysql.fetchData(function(err, results){
		if(err){
			res.send({"statusCode":"401"});
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Valid Login");
				
				var rows = results;

				//Assigning the session
				req.session.username = email;
				req.session.userhandle = rows[0].userHandle;
				console.log("User Handle:" + req.session.userhandle);
				
				console.log("Session initialized");
				
				console.log("Render profile page...");
				res.send({"statusCode":"200"});
				
			}
			else {    
				
				console.log("No users found in database");
				res.send({"statusCode":"401"});
			}
		}  
	},getUser);
	
};


//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

//Redirects to the profile page
exports.profile = function(req,res)
{
	console.log("Redirect to Profile page in login JS file...");
	res.render('profile');
};


exports.signUpUser = function(req,res)
{
	var email = req.body.serverData.email;
	var firstName = req.body.serverData.firstName;
	var lastName = req.body.serverData.lastName;
	var password = req.body.serverData.password;
	var userHandle = req.body.serverData.userHandle;
	var dob = req.body.serverData.dob;
	console.log("Telephone: " + req.body.serverData.usrTel);
	var contactNo = req.body.serverData.usrTel || null;
	var location = req.body.serverData.location || null;
	
	
	var insertUser="INSERT INTO users (`email`, `firstName`, `lastName`, `password`, `userHandle`, `birthday`, `contactInformation`, `location`) " +
	"VALUES ('" + email + "','" + firstName + "','" + lastName + "','" + password + "','" +	userHandle + "','" + dob + "','" + contactNo + "','" + location +"');";
	
	console.log("Query is:" + insertUser);	
	
	mysql.fetchData(function(err, results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Valid Sign Up..");
			console.log("Render login page...");
			res.send({"statusCode":"200"});
				
		}  
	},insertUser);
	
};