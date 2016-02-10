/**
 * Created by sridharrajs.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	username: {
		type: String
	},
	emailId: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	doj: {
		type: Number
	},
	profile_url: {
		type: String
	}
});

var ATTRIBUTES = ['_id', 'password', 'username', 'profile_url', 'doj', 'emailId'];

mongoose.model('user', schema);

function getAttributes() {
	return ATTRIBUTES;
}

module.exports = {
	getAttributes: getAttributes
};