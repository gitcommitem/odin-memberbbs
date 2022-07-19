var async = require('async');

var Post = require('../models/post');

exports.index = function (req, res, next) {
	async.parallel(
		{
			posts: function (callback) {
				Post.find({}, callback).populate('author');
			}
		},
		function (err, results) {
			if (err) {
				return next(err);
			}

			if (results.posts === null) {
				var err = new Error('No items found');
				err.status = 404;
				return next(err);
			}
			res.render('index', {
				user: req.user,
				post: results.posts
			});
		}
	);
};
