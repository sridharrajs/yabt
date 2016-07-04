/**
 * Created by sridharrajs.
 */

'use strict';

const async = require('async');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const isValidEmail = require('is-valid-email');
const qs = require('qs');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let userController = require('../controllers/user-controller');
let security = require('../middleware/auth-filter');

function login(req, res) {
	let body = qs.parse(req.body);
	let email = body.email;
	let password = body.password;

	if (!email|| !password) {
		return res.status(400).send({
			msg: 'Please enter proper values!'
		});
	}
	if (!isValidEmail(email)) {
		return res.status(400).send({
			msg: 'Please valid emailId'
		});
	}

	userController.getUserByCredentials(email).then((user)=> {
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
	let email = body.email;
	let password = body.password;

	if (!email || !password) {
		return res.status(400).send({
			msg: 'Please enter proper values!'
		});
	}
	if (!isValidEmail(email)) {
		return res.status(400).send({
			msg: 'Please valid emailId'
		});
	}

	userController.add({
		email: email,
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

	Promise.all([
		articleController.getActiveCount(userId),
		userController.getById(userId)
	]).then((results)=> {
		let user = results[1];
		res.status(200).send({
			data: {
				me: user
			}
		});
	}).catch((err) => {
		res.status(500).send({
			err: err.stack
		});
	});

}

function updateMe(req, res) {
	let body = qs.parse(req.body);

	let user = {
		userId: req.uid,
		user_name: body.user_name
	};

	let newPassword = body.newPassword;
	let reloadReq = false;
	if (newPassword && newPassword.trim()) {
		user.password = bcrypt.hashSync(newPassword);
		reloadReq = true;
	}

	if (!user.username) {
		return res.status(400).send({
			msg: 'invalid username'
		});
	}

	userController.updateByUserId(user).then(()=> {
		res.status(200).send({
			data: {
				items: items,
				reloadReq: reloadReq
			}
		});
	}).catch((err) => {
		return res.status(500).send({
			msg: err
		});
	});

}

let lastLoginUpdater = require('../middleware/last-login');
app.put('/me', [lastLoginUpdater.update], updateMe)
	.get('/me', [lastLoginUpdater.update], getMe);

app.post('/', signUp);
app.post('/login', login);

module.exports = app;
