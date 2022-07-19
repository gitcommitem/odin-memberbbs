var Account = require('../models/account');
var Post = require('../models/post');

const { body, validationResult } = require('express-validator');
const { request } = require('../app');

exports.verify_isMember_post = [
	// Validate and sanitize fields.
	body('code', 'Input must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		//Change isMember from false to true
		var account = new Account({
			username: req.user.username,
			password: req.user.password,
			isMember: true,
			isAdmin: false,
			_id: req.user.id
		});

		if (!errors.isEmpty() || req.body.code !== 'github') {
			// There are errors. Render form again with sanitized values/error messages.
			const stringError = JSON.stringify(errors.array());
			const parsedError = JSON.parse(stringError);

			res.redirect('/');
			return;
		} else {
			if (req.body.code === 'github') {
				Account.findByIdAndUpdate(req.user.id, account, {}, function (err) {
					if (err) {
						return next(err);
					}
					//Redirect to index upon success
					res.redirect('/');
				});
			}
		}
	}
];

exports.verify_isAdmin_post = [
	// Validate and sanitize fields.
	body('code', 'Input must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		//Change isAdmin from false to true
		var account = new Account({
			username: req.user.username,
			password: req.user.password,
			isMember: true,
			isAdmin: true,
			_id: req.user.id
		});

		if (!errors.isEmpty() || req.body.code !== 'odinproject') {
			// There are errors. Render form again with sanitized values/error messages.
			const stringError = JSON.stringify(errors.array());
			const parsedError = JSON.parse(stringError);

			res.redirect('/settings');
			return;
		} else {
			if (req.body.code === 'odinproject') {
				Account.findByIdAndUpdate(req.user.id, account, {}, function (err) {
					if (err) {
						return next(err);
					}
					//Redirect to index upon success
					res.redirect('/');
				});
			}
		}
	}
];

exports.verify_deleteAccount_post = [
	// Validate and sanitize fields.
	body('code', 'Input must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty() || req.body.code !== req.user.username) {
			// There are errors. Render form again with sanitized values/error messages.
			const stringError = JSON.stringify(errors.array());
			const parsedError = JSON.parse(stringError);

			res.redirect('/settings');
			return;
		} else {
			if (req.body.code === req.user.username) {
				//Delete all posts by this account
				Post.deleteMany({ author: req.user.id }, function (err) {
					if (err) {
						return next(err);
					}
				});

				//Delete account
				Account.findByIdAndDelete(req.user.id, function (err) {
					if (err) {
						return next(err);
					}

					//Logout of session
					req.logout(function (err) {
						if (err) {
							return next(err);
						}
						res.redirect('/');
					});
				});
			}
		}
	}
];
