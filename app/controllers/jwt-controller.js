/**
 * Created by sridharrajs on 6/28/16.
 */

'use strict';

let _ = require('lodash');
let jwt = require('jwt-simple');

let config = require('../../config');

function expiresIn(numDays) {
	let dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

class JWTController {

	static decodeForUid(token) {
		if (_.isEmpty(token)) {
			return null;
		}
		try {
			return jwt.decode(token, config.secret).userId;
		} catch (err) {
			return null;
		}
	}

	static generateToken(userId) {
		let expires = expiresIn(7);
		return jwt.encode({
			exp: expires,
			userId: userId
		}, config.secret);
	}

}

module.exports = JWTController;