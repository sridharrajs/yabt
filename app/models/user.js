/**
 * Created by sridharrajs.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	emailId: {
		type: String,
		required: true,
		index: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	doj: {
		type: Date,
		default: Date.now
	},
	profile_url: {
		type: String
	},
	twitter_handle: {
		type: String
	},
	last_seen: {
		type: Date,
		default: Date.now
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

let User = mongoose.model('user', schema);

User.on('index', (err) => {
	if (err) {
		console.log('Error while creating index for User ', err);
	}
});

function getAttributes() {
	return ATTRIBUTES;
}

module.exports = {
	getAttributes
};
