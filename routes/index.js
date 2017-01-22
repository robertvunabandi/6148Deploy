var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars');
var chalk = require('chalk');
var User = require('../schemas/user.js');
var passport = require('passport');

function pLog(something){
	var message = chalk.bgYellow(something);
	console.log(message);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	/*
	This code is taken from 
	https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
	*/
	if(req.isAuthenticated()) {
		res.render("index", {title: req.user.email, logged: true});
	} else {
		res.render("index", {title: 'LEXIS | Home Page', logged: false});
	}
	/*
	if (req.session && req.session.user) { // Check if session exists
		// lookup the user in the DB by pulling their email from the session
		User.findOne({userEmail:req.session.user.userEmail }, function (err, user) {
			if (!user) {
				// if the user isn't found in the DB, reset the session info and
				// redirect the user to the login page
				req.session.reset();
				// res.redirect('/');
				res.render('index', {title: 'LEXIS | Home Page', logged: false});
			} else {
				// expose the user to the template
				res.locals.user = user;
				 
				// render the dashboard page
				// res.render('/');
				res.render('index', {title: 'LEXIS | Home Page', logged: true});
			}
		});
	} else {
	res.render('index', {title: 'LEXIS | Home Page', logged: false});
	}*/
	// res.render('index', {title: 'LEXIS | Home Page'});
});
/* GET sign-up page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'LEXIS | Sign-up'});
});
/* ACTION FOR SIGN UP!*/
router.post('/userSignup', function(req, res, next){
	var userName = req.body.userName.toLowerCase();
	var userPassword = req.body.userPassword;
	var userEmail = req.body.userEmail;
	//This is to find the birthday
	var month = parseMonth(req.body.birth_month), day = req.body.birth_day, year = req.body.birth_year;
	var userBirthday = "";
	userBirthday += month+"-"+day+"-"+year;
	var user = new User({
		userName: userName,
		userPassword: userPassword,
		userEmail: userEmail,
		userBirthday: userBirthday
	});
	
	User.findOne({userName:user.userName}, function (err, user){
		if (err){
			res.send("please try again.");
		} else if (user){
			res.send("user already exists");
		} else {
			pLog("Username successful");
		}
	});
	User.findOne({userEmail:user.userEmail}, function (err, user){
		if (err){
			res.send("please try again.");
		} else if (user){
			res.send("user already exists");
		} else {
			pLog("Email successful");
		}
	});
	var message = chalk.underline.bgYellow("New User:"+userName);
	console.log(user);
	console.log(message);
	user.save();
	// Redirecting back to the root
	res.redirect('/');
});
function parseMonth(val){
	var months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
	return (months.indexOf(val.toLowerCase())+1);
}

/* GET login. */
router.post('/login', passport.authenticate('local', 
		{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: false
	})
	//function(req, res, next){
	/*if(req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.redirect('/');
	}*/
	/**
	var userInf = req.body.userInf, password = req.body.userPassword;
	var email;
	var incorrectMessage = "Invalid email or password.";
	if (userInf.search("@") !== -1){email = true;} else {email = false;}
	if (email){
		pLog("EMAIL");
		User.findOne({userEmail: userInf}, function(err, user){
			if (err){
				pLog("ERROR OCCURED");
			} else {
				if (user == null) {res.send(incorrectMessage); pLog("USERNAME WRONG");}
				else {
					if (user.userPassword === password){
						// req.session.user = user; 
						res.redirect("/");
					}
					else {res.send(incorrectMessage); pLog("PASSWORD WRONG");}
				}
			}
		});
	} else {
		pLog("USERNAME");
		User.findOne({userName: userInf}, function(err, user){
			if (err){
				pLog("ERROR OCCURED");
			} else {
				if (user == null) {res.send(incorrectMessage); pLog("USERNAME WRONG");}
				else {
					if (user.userPassword === password){
						req.session.user = user; 
						res.redirect("/");
					}
					else {res.send(incorrectMessage); pLog("PASSWORD WRONG");}
				}
			}
		});
	}
	/**/
);

/* GET user list. */
router.get('/lists', function(req, res, next) {
  res.render('lists', {title: 'LEXIS | My lists'});
});
/* GET about us page. */
router.get('/aboutUs', function(req, res, next) {
  res.render('aboutUs', {title: 'LEXIS | Who We Are'});
});
/* GET terms of services. */
router.get('/terms', function(req, res, next) {
  res.render('terms', {title: 'LEXIS | Terms of Services'});
});
/*GET search-word page. */
router.get('/search-word', function(req, res, next){});
/*POST add-word page. */
router.post('/add-word', function(req, res, next){});


module.exports = router;
