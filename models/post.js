var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
	body: { type: String, required: true },
	date: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Post', postSchema);
