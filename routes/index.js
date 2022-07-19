var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index_controller');
var signup_controller = require('../controllers/signup_controller');
var login_controller = require('../controllers/login_controller');
var post_controller = require('../controllers/post_controller');

/* GET home page. */
router.get('/', index_controller.index);

router.get('/sign-up', function (req, res, next) {
	res.render('signuplogin');
});

router.get('/login', function (req, res, next) {
	res.render('signuplogin', { isLogin: true });
});

router.get('/log-out', function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

router.post('/sign-up', signup_controller.signup_post);
router.post('/login', login_controller.login_post);
router.post('/new-post', post_controller.post_new_post);

module.exports = router;
