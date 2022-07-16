var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('Account', accountSchema);
