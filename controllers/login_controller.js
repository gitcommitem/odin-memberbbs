const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.login_post = [
	// Validate and sanitize fields.
	body('username', 'Username must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('password', 'Password must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

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
			//No errors, attempt to authenticate user
			passport.authenticate('local', {
				successRedirect: '/',
				failureRedirect: '/login'
			})(req, res, next);
		}
	}
];
