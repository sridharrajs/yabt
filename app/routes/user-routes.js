/**
 * Created by sridharrajs.
 */

'use strict';

const _ = require('lodash');
const async = require('async');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const isValidEmail = require('is-valid-email');
const qs = require('qs');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let userController = require('../controllers/user-controller');
let security = require('../middleware/auth-filter');

let pageUtil = require('../utils/page-utils');

function getArticleCount(userId, callback) {
	articleController.getActiveCount({
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

function login(req, res) {
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

	userController.getUserByCredentials(emailId).then((user)=> {
		let saltedPwd = user.password;
		return bcrypt.compare(password, saltedPwd).then(()=> {
			return Promise.resolve({
				user
			});
		});
	}).then((user)=> {
		res.status(200).send({
			token: security.generateToken(user.userId),
			profile_url: user.profile_url
		});
	}).catch((err) => {
		if (err instanceof bcrypt.MISMATCH_ERROR) {
			return res.status(401).send({
				msg: 'Invalid password'
			});
		}
		return res.status(401).send({
			msg: 'Invalid emailId/password'
		});
	});

}

function signUp(req, res) {
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

	userController.add({
		emailId: emailId,
		password: bcrypt.hashSync(password)
	}, (err, user) => {
		if (err) {
			return res.status(500).send({
				err: err
			});
		}
		let token = security.generateToken(user._id);
		res.status(200).send({
			msg: 'User created successfully!',
			token: token,
			profile_url: user.profile_url
		});
	});

}

function getMe(req, res) {
	let userId = req.uid;

	async.parallel([
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

		let user = items[1];

		if (_.isEmpty(user)) {
			return res.status(401).send({
				msg: 'user doesnt exist'
			});
		}

		res.status(200).send({
			data: {
				articlesCount: _.size(_.first(items)),
				tags: pageUtil.getTags(),
				profile_url: user.profile_url,
				username: user.username,
				emailId: user.emailId
			}
		});
	});
}

function updateMe(req, res) {
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

}

let lastLoginUpdater = require('../middleware/last-login');
app.put('/me', [lastLoginUpdater.update], updateMe)
	.get('/me', [lastLoginUpdater.update], getMe);

app.post('/', signUp);
app.post('/login', login);

module.exports = app;
