var bcrypt = require('bcryptjs');
var Account = require('../models/account');

const passport = require('passport');

const { check, body, validationResult } = require('express-validator');

exports.signup_post = [
	// Validate and sanitize fields.
	body('username', 'Username must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('password', 'Password must be at minimum 8 characters long')
		.trim()
		.isLength({ min: 8 })
		.escape(),
	check('confirmPassword').custom(function (value, { req }) {
		if (value !== req.body.password) {
			throw new Error('Passwords do not match');
		}
		return true;
	}),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			const stringError = JSON.stringify(errors.array());
			const parsedError = JSON.parse(stringError);

			res.render('signuplogin', {
				errors: parsedError
			});
			return;
		} else {
			//Check if username is already taken
			Account.findOne({
				username: { $regex: `^${req.body.username}$`, $options: 'i' }
			}).exec(function (err, takenUsername) {
				if (err) {
					return next(err);
				}
				if (takenUsername) {
					//Username is already taken, show error
					const takenError = [
						{
							msg: `Sorry, the username ${req.body.username} is already taken`
						}
					];

					res.render('signuplogin', {
						errors: takenError
					});
					return;
				} else {
					//Username is available, go ahead and hash password
					bcrypt.hash(req.body.password, 10, function (err, hash) {
						if (err) {
							return next(err);
						} else {
							// Create an account object with escaped and trimmed data along with hashed password
							var account = new Account({
								username: req.body.username,
								password: hash,
								isMember: false,
								isAdmin: false
							});
							// Data from form is valid. Save account.
							account.save(function (err) {
								if (err) {
									return next(err);
								}
								//successful - redirect.
								passport.authenticate('local', {
									successRedirect: '/',
									failureRedirect: '/login'
								})(req, res, next);
							});
						}
					});
				}
			});
		}
	}
];
