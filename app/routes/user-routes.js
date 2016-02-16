/**
 * Created by sridharrajs.
 */

'use strict';

const _ = require('lodash');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const isValidEmail = require('is-valid-email');
const qs = require('qs');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let userController = require('../controllers/user-controller');
let security = require('../middlewares/auth-filter');

let pageUtil = require('../utils/page-utils');

function getArticleCount(userId, callback) {
	articleController.getArticleCount({
		userId
	}, (err, count) => {
		callback(err, count);
	});
}

function geUserInfo(userId, callback) {
	userController.getUserByUserId(userId, (err, items)=> {
		callback(err, _.first(items));
	});
}

app.post('/login', (req, res) => {
	try {
		let body = qs.parse(req.body);
		let emailId = body.emailId;
		let password = body.password;

		if (!emailId || !password) {
			return res.status(400).send({
				msg: 'Please enter proper values!'
			});
		}
		if (!isValidEmail(emailId)) {
			return res.status(400).send({
				msg: 'Please valid emailId'
			});
		}
		userController.getUserByCredentials(emailId, function (err, items) {
			if (err || _.isEmpty(items)) {
				return res.status(403).send({
					msg: 'Invalid emailId/password'
				});
			}
			let userObj = items[0];
			let saltedPwd = userObj.password;
			bcrypt.compare(password, saltedPwd, (err, isEqual) => {
				if (!isEqual) {
					return res.status(403).send({
						msg: 'Invalid emailId/password'
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
});

app.post('/', (req, res) => {
	let body = qs.parse(req.body);
	let emailId = body.emailId;
	let password = body.password;

	if (!emailId || !password) {
		return res.status(400).send({
			msg: 'Please enter proper values!'
		});
	}
	if (!isValidEmail(emailId)) {
		return res.status(400).send({
			msg: 'Please valid emailId'
		});
	}

	let encryptedPwd = bcrypt.hashSync(password);
	let user = {
		emailId: emailId,
		password: encryptedPwd
	};

	userController.add(user, (err, user) => {
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
});

app
	.get('/me', (req, res)=> {
		let userId = req.uid;

		async
			.parallel([
				(callback)=> {
					getArticleCount(userId, callback);
				},
				(callback)=> {
					geUserInfo(userId, callback);
				}
			], (err, items) => {
				if (err) {
					return res.status(500).send({
						msg: err
					});
				}
				res.status(200).send({
					data: {
						articlesCount: _.size(_.first(items)),
						tags: pageUtil.getTags(),
						profile_url: items[1].profile_url,
						username: items[1].username,
						emailId: items[1].emailId
					}
				});
			});

	})
	.put('/me', (req, res)=> {
		let body = qs.parse(req.body);

		let userObj = {
			userId: req.uid,
			username: body.username
		};

		let newPassword = body.newPassword;
		let reloadReq = false;
		if (newPassword && newPassword.trim()) {
			userObj.password = bcrypt.hashSync(newPassword);
			reloadReq = true;
		}

		if (!userObj.username) {
			return res.status(400).send({
				msg: 'invalid username'
			});
		}

		userController.updateByUserId(userObj, (err, items) => {
			if (err) {
				return res.status(500).send({
					msg: err
				});
			}
			res.status(200).send({
				data: {
					items: items,
					reloadReq: reloadReq
				}
			});
		});

	});

module.exports = app;
