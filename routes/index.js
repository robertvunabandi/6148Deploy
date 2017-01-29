var express = require('express');
var passport = require('passport');
var User = require('../schemas/user.js');
var router = express.Router();
var chalk = require('chalk');
var sanitize = require('mongo-sanitize');
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
		case "green":
			message = chalk.bgGreen(something);
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
	if(req.isAuthenticated()) {res.render("index", {title: 'LEXIS', logged: true, underlineLexis:true , user: req.user});}
	else {res.render("index", {title: 'LEXIS | Home Page', logged: false, underlineLexis:true});}
});
/* GET sign-up page. */
router.get('/signup', function(req, res, next) {
	if(req.isAuthenticated()) {res.redirect('/');}
	else {res.render('signup', {title: 'LEXIS | Sign-up', usererror: false, emailerror: false, error:false, underlineSignup:true});}
});
/* GET login page. */
router.get('/login', function(req, res, next){
	if(req.isAuthenticated()) {res.redirect('/');}
	else {res.render('login', {title: 'Lexis | Log-in', error:false, underlineLogin:true});}
});
/* ACTION FOR SIGN UP */
router.post('/userSignup', function(req, res, next){
	var userName = req.body.userName.toLowerCase();
	var userPassword = req.body.userPassword;
	if (userPassword[0] == "$" || typeof(password) == "object"){
		res.render('signup', {title: 'LEXIS | Sign-up', usererror: false, emailerror: false, passworderror:true, error:true, underlineSignup:true});
	}
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
	User.findOne({username:user.username}, function (err, userSearch){
		if (err){
			res.render('signup', {title: 'LEXIS | Sign-up', usererror: false, emailerror: false, error:true, underlineSignup:true});
		} else if (userSearch){
			var usererror = true;
			pLog("USERNAME-", "red");
		} else {
			var usererror = false;
			pLog("USERNAME+", "green");
		}
		User.findOne({email:user.email}, function (err, userSearch){
			if (err){
				res.render('signup', {title: 'LEXIS | Sign-up', usererror: usererror, emailerror: false, error:true, underlineSignup:true});
			} else if (userSearch){
				var emailerror = true;
				pLog("EMAIL-", "red");
			} else {
				var emailerror = false;
				pLog("EMAIL+", "green");
			}
			if (usererror || emailerror){
				res.render('signup', {title: 'LEXIS | Sign-up', usererror: usererror, emailerror: emailerror, error:false, underlineSignup:true});
			}
			/*user.save(function(err){
				if (err){pLog("ERR:_"+err);}
				else {pLog("NEW_USER:_"+userName+",_"+userEmail);}
			});*/
			User.register(user, userPassword, function(regErr) {
				if(!regErr) {
					pLog("USER+", "green");
					req.login(user, function(loginError) {
						if (loginError) { return next(loginError); }
						return res.redirect('/login');
					});
				} else {
					pLog("USER-", "red", regErr);
					pLog(regErr, "blue");
					// res.render('signup', {title: 'LEXIS | Sign-up', usererror: usererror, emailerror: emailerror, error:true, underlineSignup:true});
				}
			});
		});
	});
});
/* ACTION FOR LOGIN when user clicks on login */
router.post('/userLogin', function(req, res, next){
	var username = sanitize(req.body.username), password = req.body.password;
	pLog(username, password);
	if (password[0] == "$" || typeof(password) == "object"){
		pLog("MALICIOUS USER", "red");
		return res.render('login',{title: "Lexis | Log-in", error: false, passworderror:true});
	}
	User.findOne({username: username}, function(err, user){
		if (err){
			pLog("ERROR OCCURED");
			return res.render('login',{title: "Lexis | Log-in", error: true, passworderror:false});
		} else {
			if (user == null) {return res.render('login',{title: "Lexis | Log-in", error: true, underlineLogin:true}); pLog("USERNAME NULL", "red");}
			else {
				pLog("NEXT+", "green");
				next();
			}
		}
	});
}, passport.authenticate('local', {
	successRedirect:'/',
	failureRedirect:'/login',
	failureFlash:false})
);
/*action for logout*/
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
/* GET user word page. */
router.get('/userWords', function(req, res, next) {
	if (req.isAuthenticated){res.render('userWords', {title: 'LEXIS | My words', logged: true, underlineWords: true});}
	else (res.redirect('/'));
});
/* GET user actual words. */
router.post('/words', function(req, res, next) {
	var message = {error: false, data:[]};
	if (req.isAuthenticated){
		message.error = false;
		User.findOne({username:req.user.username}, function (err, user){
			if (err){
				message.error = true;
				message.data.push("An error occured when processing your username in the server.");
				return res.send(message);
			}
			var index = user.userWords.length;
			if (index == 0){
				message.data.push("You have not saved any word yet.");
				return res.send(message);
			}
			else {
				var words = [];
				for (var x = 0; x < index; x++){
					words.push(user.userWords[x].word);
				}
				message.data = words;
				return res.send(message);
			}
		});
	} else {
		message.error = true;
		message.data.push("An error occured. Username is not logged in.");
		return res.send(message);
	}
});
/*POST save word definition page. */
router.post('/saveDefinition', function(req, res, next){
	var message = {success: false, data:""};
	var word = req.body.word, definition = req.body.def;
	if(req.isAuthenticated()) {
		message.success = false;
		User.findOne({username:req.user.username}, function (err, user){
			if (err){
				message.success = true;
				message.data.push("An error occured when processing your username in the server.");
				return res.send(message);
			}
			var userWords = [];
			var length = user.userWords.length;
			for (var x = 0; x < length; x++){
				userWords.push(user.userWords[x].word);
			}
			var index = userWords.indexOf(word);
			if (index === -1){
				message.success = false;
				message.data = "INTERNAL ERROR.";
				return res.send(message);
			}
			user.userWords[index].definition = definition;
			user.save();
			message.data = "definition saved";
			return res.send(message);
		});
	}
	else {
		message = {success: false, data:"The server indicated that you are not logged in."};
		return res.send(message);
	}
});
/* GET about us page. */
router.get('/aboutUs', function(req, res, next) {
  res.render('aboutUs', {title: 'LEXIS | Who We Are'});
});
/*GET search-word page. */
router.get('/search-word', function(req, res, next){});
/*POST add-word page. */
router.post('/add-word', function(req, res, next){
	var message;
	if(req.isAuthenticated()) {
		var word = req.body.word.toLowerCase();
		pLog(word);
		// pLog(req.user.useWords);
		User.findOne({username: req.user.username}, function (err, user){
			var index = user.userWords.length;
			user.userWords[index] = {word: word, id: index};
			user.save();
		});
		message = {success:true, message:"<h5><span style='color: rgba(222,204,145,1);'>"+word+"</span> is now in your words</h5>"};
	}
	else {
		message = {success:false, message:"<h5>sign up or log in to add a new word</h5>"};
	}
	message.message += "<p>Click here to dismiss</p>";
	res.send(message);
});


module.exports = router;
