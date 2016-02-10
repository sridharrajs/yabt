/**
 * Created by sridharrajs.
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ = require('lodash');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var express = require('express');
var isValidEmail = require('is-valid-email');
var qs = require('qs');

var app = express.Router();

var articleController = require('../controllers/article-controller');
var userController = require('../controllers/user-controller');
var security = require('../middlewares/auth-filter');

var pageUtil = require('../utils/page-utils');

app.post('/login', function (req, res) {
	try {
		var _ret = function () {
			var body = qs.parse(req.body);
			var emailId = body.emailId;
			var password = body.password;

			if (!emailId || !password) {
				return {
					v: res.status(400).send({
						msg: 'Please enter proper values!'
					})
				};
			}
			if (!isValidEmail(emailId)) {
				return {
					v: res.status(400).send({
						err: 'Please valid emailId'
					})
				};
			}
			userController.getUserByCredentials(emailId, function (err, items) {
				if (err || _.isEmpty(items)) {
					return res.status(403).send({
						err: 'Invalid emailId/password'
					});
				}
				var userObj = items[0];
				var saltedPwd = userObj.password;
				bcrypt.compare(password, saltedPwd, function (err, isEqual) {
					if (!isEqual) {
						return res.status(403).send({
							err: 'Invalid emailId/password'
						});
					}
					var userId = userObj._id;
					var token = security.generateToken(userId);
					res.status(200).send({
						token: token,
						profile_url: userObj.profile_url
					});
				});
			});
		}();

		if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	} catch (err) {
		console.log('err', err);
	}
});

app.post('/', function (req, res) {
	var body = qs.parse(req.body);
	var emailId = body.emailId;
	var password = body.password;

	if (!emailId || !password) {
		return res.status(400).send({
			err: 'Please enter proper values!'
		});
	}
	if (!isValidEmail(emailId)) {
		return res.status(400).send({
			msg: 'Please valid emailId'
		});
	}

	var encryptedPwd = bcrypt.hashSync(password);
	var user = {
		emailId: emailId,
		password: encryptedPwd
	};

	userController.add(user, function (err, user) {
		if (err) {
			return res.status(500).send();
		}
		var token = security.generateToken(user._id);
		res.status(200).send({
			msg: 'User created successfully!',
			token: token,
			profile_url: user.profile_url
		});
	});
});

app.get('/me', function (req, res) {
	var userId = req.uid;

	async.parallel([function (callback) {
		getArticleCount(userId, callback);
	}, function (callback) {
		getProfilePic(userId, callback);
	}], function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			data: {
				count: _.first(items),
				tags: pageUtil.getTags(),
				profile_url: items[1].profile_url,
				username: items[1].username
			}
		});
	});
});

function getArticleCount(userId, callback) {
	articleController.getArticleCount({
		userId: userId
	}, function (err, count) {
		callback(err, count);
	});
}

function getProfilePic(userId, callback) {
	userController.getUserByUserId(userId, function (err, items) {
		var person = _.first(items);
		callback(err, {
			profile_url: person.profile_url,
			username: person.username
		});
	});
}

module.exports = app;