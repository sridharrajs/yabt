/**
 * Created by sridharrajs.
 */

'use strict';

var gravatar = require('nodejs-gravatar');
var mongoose = require('mongoose');
var wrapper = require('mongoose-callback-wrapper');
var ObjectId = require('mongoose').Types.ObjectId;

var userModelSchema = require('../models/user');
var userModel = mongoose.model('user');

var add = function add(user, cb) {
	var item = new userModel({
		emailId: user.emailId,
		password: user.password,
		profile_url: gravatar.imageUrl(user.emailId)
	});
	item.save(function (err, newDoc) {
		if (!err) {
			var _user = {
				_id: newDoc._id,
				profile_url: newDoc.profile_url
			};
			cb(null, _user);
		} else {
			cb('error');
		}
	});
};

var updateToken = function updateToken(userId, token, cb) {
	var condition = {
		_id: userId
	};
	var update = {
		token: token
	};
	var upsert = false;
	userModel.findOneAndUpdate(condition, update, upsert, cb);
};

var getUserByCredentials = function getUserByCredentials(emailId, cb) {
	var wrappedCallback = wrapper.wrap(cb, userModelSchema.getAttributes());
	var query = userModel.find({
		emailId: emailId
	});
	query.exec(wrappedCallback);
};

var getUserByUserId = function getUserByUserId(userId, cb) {
	var wrappedCallback = wrapper.wrap(cb, userModelSchema.getAttributes());
	var query = userModel.find({
		_id: new ObjectId(userId)
	});
	query.exec(wrappedCallback);
};

module.exports = {
	add: add,
	getUserByCredentials: getUserByCredentials,
	updateToken: updateToken,
	getUserByUserId: getUserByUserId
};