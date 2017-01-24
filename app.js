var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//Load users from the right file, how can I test this?
var User = require('./schemas/user.js');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var app = express();
app.use(bodyParser.json());

//-!-with cookie-session
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'lexis-session',
    keys: ['ujjdZhoGm5gXMqLIkVQTMH8DOw1OwfkMSopyPt77','Hc6eYciKdxz4QRpt72ExfJaczoT95FPorpxw6Dld','UKoJv204uCPOVHwF2UFz9d1CeqRh3hwjy3tUuDOU'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true
  })
);
//-!-with express-session
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'ujjdZhoGm5gXMqLIkVQTMH8DOw1OwfkMSopyPt77', resave: 'false', saveUninitialized: 'true' }));
app.use(passport.initialize());
app.use(passport.session());
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
//May have to delete all this...
/*app.post('/userLogin',
  passport.authenticate('local', {
    successRedirect: '/', //SOMEHOW Manage to bring back the modal!
    failureRedirect: '/',
    failureFlash: false
  })
);
app.get('/', function (req, res, next) {
  if(req.isAuthenticated()) {
    console.log("YAAAY LOGGED");
    res.render("index", {title: req.user.email, logged: true});
  } else {
    console.log("NOT LOGGED");
    res.render("index", {title: 'LEXIS | Home Page', logged: false});
  }
});*/

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
var chalk = require('chalk');

var favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var logger = require('morgan');
app.use(logger('dev'));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
var users = require('./routes/users');
// connect server needs mongoose
var mongoose = require('mongoose');
// connect mongoose to MongoDB
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/lexis')
var connection = mongoose.connection;
// error handler
connection.on("error", console.error.bind(console, 'connection error:'));
//runs when the connection is successful
connection.on("connected", function(){
  var message = chalk.bgBlue.red.bold.underline("DATABASE CONNECTED!");
  console.log(message);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({extname: '.hbs'}));
// Passport stuffs
app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler

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
