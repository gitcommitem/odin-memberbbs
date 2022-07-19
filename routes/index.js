var express = require('express');
var router = express.Router();

var signup_controller = require('../controllers/signup_controller');
var login_controller = require('../controllers/login_controller');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		user: req.user
	});
});

router.get('/sign-up', function (req, res, next) {
	res.render('signuplogin');
});

router.get('/login', function (req, res, next) {
	res.render('signuplogin', { isLogin: true });
});

router.post('/sign-up', signup_controller.signup_post);
router.post('/login', login_controller.login_post);

module.exports = router;
