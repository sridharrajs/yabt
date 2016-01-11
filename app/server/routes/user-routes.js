/**
 * Created by sridharrajs.
 */

'use strict';

const _ = require('lodash');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const isValidEmail = require('is-valid-email');
const qs = require('qs');

let userController = require('../controller/user-controller');
let security = require('../middlewares/auth-filter');

let loginUser = function (req, res) {
	try {
		let body = qs.parse(req.body);
		let emailId = body.emailId;
		let password = body.password;

		if (!emailId || !password) {
			return res.status(400).send({
				err: 'Please enter proper values!'
			});
		}
		if (!isValidEmail(emailId)) {
			return res.status(400).send({
				err: 'Please valid emailId'
			});
		}
		userController.getUserByCredentials(emailId, function (err, items) {
			if (err || _.isEmpty(items)) {
				return res.status(403).send({
					err: 'Invalid emailId/password'
				});
			}
			let userObj = items[0];
			let saltedPwd = userObj.password;
			bcrypt.compare(password, saltedPwd, function (err, isEqual) {
				if (!isEqual) {
					return res.status(403).send({
						err: 'Invalid emailId/password'
					});
				}
				let userId = userObj._id;
				let token = security.generateToken(userId);
				res.status(200).send({
					token: token,
					profile_url: userObj.profile_url
				});
			});
		});
	} catch (err) {
		console.log('err', err);
	}
};

let signup = function (req, res) {
	let body = qs.parse(req.body);
	let emailId = body.emailId;
	let password = body.password;

	if (!emailId || !password) {
		return res.status(400).send({
			err: 'Please enter proper values!'
		});
	}
	if (!isValidEmail(emailId)) {
		return res.status(400).send({
			err: 'Please valid emailId'
		});
	}

	let encryptedPwd = bcrypt.hashSync(password);
	let user = {
		emailId: emailId,
		password: encryptedPwd
	};

	userController.add(user, function (err, user) {
		if (err) {
			return res.status(500).send();
		}
		let token = security.generateToken(user._id);
		res.status(200).send({
			msg: 'User created successfully!',
			token: token,
			profile_url: user.profile_url
		});
	});
};

let getUserByToken = function (token, validateCb) {
	async.waterfall([function (callback) {
		let cb = function (err, items) {
			let userId = '';
			if (!_.isEmpty(items)) {
				userId = items[0].id;
				buffer.addTokenToId(token, userId);
				callback(null, userId);
			} else {
				callback('invalid user');
			}
		};
		userController.getUserByToken(token, cb);
	}], function (err, userId) {
		validateCb(err, userId);
	});
};

module.exports = {
	signup,
	getUserByToken,
	loginUser,
};
