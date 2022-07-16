var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
	poster: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
	text: { type: String, required: true },
	date: { type: Date, required: true }
});

module.exports = mongoose.model('Post', postSchema);
