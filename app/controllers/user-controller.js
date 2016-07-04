/**
 * Created by sridharrajs.
 */

'use strict';

let gravatar = require('nodejs-gravatar');
let mongoose = require('mongoose');

let User = mongoose.model('user');

function add(user) {
	let item = new User({
		email: user.email,
		password: user.password,
		profile_url: gravatar.imageUrl(user.email),
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
	}).exec();
}

function getUserByCredentials(email) {
	return User.findOne({
		email
	}).exec();
}

function getById(userId) {
	return User.findOne({
		_id: userId
	}).exec();
}

function updateByUserId(user) {
	let update = {
		user_name: user.user_name
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
		user_name: 1,
		email: 1,
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
	getById,
	updateByUserId,
	updateLastSeen
};