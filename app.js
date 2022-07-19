var dotenv = require('dotenv');
dotenv.config();

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

//Setup Passport functions
var Account = require('./models/account');
passport.use(
	new LocalStrategy((username, password, done) => {
		Account.findOne({ username: username }, (err, account) => {
			if (err) {
				return done(err);
			}
			if (!account) {
				return done(null, false, { message: 'Incorrect username' });
			}
			bcrypt.compare(password, account.password, (err, res) => {
				if (res) {
					//Passwords match
					return done(null, account);
				} else {
					//Passwords do not mathc
					return done(null, false, { message: 'Incorrect password' });
				}
			});
		});
	})
);

passport.serializeUser(function (account, done) {
	done(null, account.id);
});

passport.deserializeUser(function (id, done) {
	Account.findById(id, function (err, account) {
		done(err, account);
	});
});

//Login session + Passport
app.use(
	session({ secret: 'oshicpsaikou', resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
