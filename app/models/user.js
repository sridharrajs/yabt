/**
 * Created by sridharrajs.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
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
	},
	twitter_handle: {
		type: String
	}
});

const ATTRIBUTES = [
	'_id',
	'password',
	'username',
	'profile_url',
	'doj',
	'emailId',
	'twitter_handle'
];

mongoose.model('user', schema);

function getAttributes() {
	return ATTRIBUTES;
}

module.exports = {
	getAttributes
};
