var express = require('express');
var passport = require('passport');
var User = require('../schemas/user.js');
var router = express.Router();
var chalk = require('chalk');
function pLog(something, color){
	var message;
	switch (color){
		case "red":
			message = chalk.bgRed(something);
		case "cyan":
			message = chalk.bgCyan(something);
		case "magenta":
			message = chalk.bgMagenta(something);
		break;
		case "blue":
			message = chalk.bgBlue(something);
		break;
		case true:
		case false:
		case null:
		default:
			message = chalk.bgYellow(something);
		break;
	}
	console.log(message);
}
function parseMonth(val){
	var months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
	return (months.indexOf(val.toLowerCase())+1);
}
/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.isAuthenticated()) {res.render("index", {title: 'LEXIS', logged: true, user: req.user});}
	else {res.render("index", {title: 'LEXIS | Home Page', logged: false});}
});
/* GET sign-up page. */
router.get('/signup', function(req, res, next) {
	if(req.isAuthenticated()) {res.redirect('/');}
	else {res.render('signup', {title: 'LEXIS | Sign-up', usererror: false, emailerror: false, error:false});}
});
/* GET login page. */
router.get('/login', function(req, res, next){
	if(req.isAuthenticated()) {res.redirect('/');}
	else {res.render('login', {title: 'Lexis | Log-in', error:false});}
});
/* ACTION FOR SIGN UP */
router.post('/userSignup', function(req, res, next){
	var userName = req.body.userName.toLowerCase();
	var userPassword = req.body.userPassword;
	var userEmail = req.body.userEmail;
	//This is to find the birthday
	var month = parseMonth(req.body.birth_month), day = req.body.birth_day, year = req.body.birth_year;
	var userBirthday = "";
	userBirthday += month+"-"+day+"-"+year;
	var user = new User({
		username: userName,
		email: userEmail,
		userBirthday: userBirthday
	});
	pLog("SO GOOD SO FAR 4");
	User.findOne({username:user.userName}, function (err, userSearch){
		if (err){
			res.render('signup', {title: 'LEXIS | Sign-up', usererror: false, emailerror: false, error:true});
		} else if (userSearch){
			var usererror = true;
		} else {
			var usererror = false;
			pLog("Username successful");
		}
		User.findOne({email:user.userEmail}, function (err, userSearch){
			if (err){
				res.render('signup', {title: 'LEXIS | Sign-up', usererror: false, emailerror: false, error:true});
			} else if (userSearch){
				var emailerror = true;
			} else {
				emailerror = false;
				pLog("Email successful");
				user.save(function(err){
					if (err){pLog("ERR:"+err);}
					else {pLog("New User: "+userName);}
				});
				User.register(user, userPassword, function(regErr) {
					pLog(!regErr);
					if(!regErr) {
						req.login(user, function(loginError) {
							if (loginError) { return next(loginError); }
							return res.redirect('/login');
						});
					} else {
						pLog("ERROR REGISTRATION", "red");
						res.render('signup', {title: 'LEXIS | Sign-up', usererror: usererror, emailerror: emailerror, error:true});
					}
				});
			}
		});
	});
});
/* ACTION FOR LOGIN when user clicks on login */
router.post('/userLogin', function(req, res, next){
	var username = req.body.username, password = req.body.password;
	pLog(username);
	User.findOne({username: username}, function(err, user){
		if (err){
			pLog("ERROR OCCURED");
		} else {
			if (user == null) {res.render('login',{title: "Lexis | Log-in", error: true}); pLog("USERNAME WRONG", "red");}
			else {
				next();
			}
		}
	});
}, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: 'Invalid username or password.' })
);
/*action for logout*/
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
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
router.post('/add-word', function(req, res, next){
	if(req.isAuthenticated()) {}
	else {}
});


module.exports = router;
