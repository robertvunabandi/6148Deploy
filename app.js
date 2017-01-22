var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./schemas/user.js');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var chalk = require('chalk');

// connect server needs mongoose
var mongoose = require('mongoose');
// connect mongoose to MongoDB
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/lexis')
var connection = mongoose.connection;
// error handler
connection.on("error", console.error.bind(console, 'connection error:'));
//runs when the connection is successful
connection.on("connected", function(){
	var message = chalk.bgYellow.blue.bold.underline("DATABASE CONNECTED!");
	console.log(message);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({extname: '.hbs'}));
// app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuffs
app.use(session({ secret: 'loveiscatthedogthatcriedformomyfantapradagucci', resave: 'false', saveUninitialized: 'true' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
//____________________________________________________________
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//____________________________________________________________


/**
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});/**/

module.exports = app;
