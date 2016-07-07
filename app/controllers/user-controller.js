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
		user_name: user.email
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
		email: email
	}).exec();
}

function getById(userId) {
	return User.findOne({
		_id: userId
	}).select({
		_id: 0,
		email: 1,
		profile_url: 1,
		user_name: 1
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
	}).exec();
}

function updateLastSeen(userId) {
	return User.findOneAndUpdate({
		_id: userId
	}, {
		updated_at: Date.now()
	}, {
		upsert: false,
		'new': true
	}).exec();
}

function createAdmin(user) {
	let item = new User({
		email: user.email,
		password: user.password,
		profile_url: gravatar.imageUrl(user.email),
		user_name: user.email,
		is_admin: true
	});
	return item.save().catch((err) => {
		if (err.code === 11000) {
			return Promise.reject('EmailId is already taken');
		}
	});
}

module.exports = {
	add,
	createAdmin,
	getUserByCredentials,
	updateToken,
	getById,
	updateByUserId,
	updateLastSeen
};