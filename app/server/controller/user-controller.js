/**
 * Created by sridharrajs.
 */

'use strict';

let gravatar = require('nodejs-gravatar');
let mongoose = require('mongoose');

let userModelSchema = require('../models/user');
let wrapper = require('../utils/mongoose-callback-wrapper');
let userModel = mongoose.model('user');

let add = function (user, cb) {
	let item = new userModel({
		emailId: user.emailId,
		password: user.password,
		profile_url: gravatar.imageUrl(user.emailId)
	});
	item.save(function (err, newDoc) {
		if (!err) {
			let user = {
				_id: newDoc._id,
				profile_url: newDoc.profile_url
			};
			cb(null, user);
		} else {
			cb('error');
		}
	});
};

let updateToken = function (userId, token, cb) {
	let condition = {
		_id: userId
	};
	let update = {
		token: token
	};
	let upsert = false;
	userModel.findOneAndUpdate(condition, update, upsert, cb);
};

let getUserByCredentials = function (emailId, cb) {
	let wrappedCallback = wrapper.wrap(cb, userModelSchema.getAttributes());
	let query = userModel.find({
		emailId: emailId
	});
	query.exec(wrappedCallback);
};

module.exports = {
	add,
	getUserByCredentials,
	updateToken
};