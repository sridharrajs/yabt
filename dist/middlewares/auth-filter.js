/**
 * Created by sridharrajs.
 */

'use strict';

var _ = require('lodash');
var jwt = require('jwt-simple');

var config = require('../../config');

var NON_AUTH_URLS = ['/api/users', '/api/users/login', '/api/join'];

function isNonAuthEndPointAccessURL(url) {
	return _.contains(NON_AUTH_URLS, url);
}

var authenticate = function authenticate(req, res, next) {
	var token = req.headers.authorization;
	var isNonAuthURL = isNonAuthEndPointAccessURL(req.url);

	if (isNonAuthURL) {
		return next();
	}

	if (!token) {
		return res.status(401).send({
			err: 'please login'
		});
	}
	try {
		var decoded = jwt.decode(token, config.secret);
		var userId = decoded.userId;
		if (!userId) {
			return res.status(401).send({
				err: 'please login'
			});
		}
		req.uid = userId;
		next();
	} catch (ex) {
		console.log('Exception ', ex);
	}
};

function getValidURLs() {
	return NON_AUTH_URLS;
}

function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

var generateToken = function generateToken(userId) {
	var expires = expiresIn(7);
	return jwt.encode({
		exp: expires,
		userId: userId
	}, config.secret);
};

module.exports = {
	authenticate: authenticate,
	isNonAuthEndPointAccessURL: isNonAuthEndPointAccessURL,
	generateToken: generateToken,
	getValidURLs: getValidURLs
};