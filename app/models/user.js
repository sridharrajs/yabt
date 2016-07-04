/**
 * Created by sridharrajs.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
	user_name: {
		type: String,
		index: true,
		unique: true
	},
	email: {
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
	last_seen: {
		type: Date,
		default: Date.now
	}
});

const ATTRIBUTES = [
	'_id',
	'password',
	'user_name',
	'profile_url',
	'doj',
	'email',
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
