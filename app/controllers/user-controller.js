/**
 * Created by sridharrajs.
 */

'use strict';

let gravatar = require('nodejs-gravatar');
let mongoose = require('mongoose');

let User = mongoose.model('user');

function add(user) {
	let item = new User({
		emailId: user.emailId,
		password: user.password,
		profile_url: gravatar.imageUrl(user.emailId),
		username: user.emailId
	});
	return item.save().catch((err) => {
		if (err.code === 11000) {
			return Promise.reject('EmailId is already taken');
		}
	});
}

function updateToken(userId, token) {
	return User.findOneAndUpdate({
		_id: userId
	}, {
		token
	}, {
		upsert: false
	});
}

function getUserByCredentials(email) {
	return User.findOne({
		email
	}).exec();
}

function getUserByUserId(userId) {
	return User.find({
		_id: userId
	}).exec();
}

function updateByUserId(user) {
	let update = {
		username: user.username
	};
	if (user.password) {
		update.password = user.password;
	}

	return User.findOneAndUpdate({
		_id: user.userId
	}, update, {
		upsert: false,
		'new': true
	}).select({
		username: 1,
		emailId: 1,
		profile_url: 1
	}).exec();
}

function updateLastSeen(userId) {
	return User.findOneAndUpdate({
		_id: userId
	}, {
		last_seen: Date.now()
	}, {
		upsert: false,
		'new': true
	}).exec();
}

module.exports = {
	add,
	getUserByCredentials,
	updateToken,
	getUserByUserId,
	updateByUserId,
	updateLastSeen
};