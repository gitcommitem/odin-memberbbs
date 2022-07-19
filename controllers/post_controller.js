var Post = require('../models/post');

const { body, validationResult } = require('express-validator');

exports.post_new_post = [
	// Validate and sanitize fields.
	body('body', 'Text must not be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		var post = new Post({
			author: req.user.id,
			body: req.body.body,
			date: Date.now()
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			const stringError = JSON.stringify(errors.array());
			const parsedError = JSON.parse(stringError);

			res.render('/', {
				errors: parsedError
			});
			return;
		} else {
			// Data from form is valid. Save account.
			post.save(function (err) {
				if (err) {
					return next(err);
				}
				//successful - redirect.
				res.redirect('/');
			});
		}
	}
];

exports.post_delete_post = function (req, res, next) {
	Post.findByIdAndDelete(req.body.id, function deleteItem (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
