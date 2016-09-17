/**
 * Created by sridharrajs on 9/6/16.
 */

'use strict';

let _ = require('lodash');

const SUCCESS_CODES = [
	200,
	201,
	301,
	302
];

class ResponseUtils {

	static isFailure(response) {
		if (_.isUndefined(response)) {
			return true;
		}
		return !_.contains(SUCCESS_CODES, response.statusCode);
	}

	static extractStatusCode(response) {
		if (_.isUndefined(response)) {
			return 0;
		}
		return response.statusCode;
	}

}

module.exports = ResponseUtils;