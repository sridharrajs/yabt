/**
 * Created by sridharrajs on 1/12/16.
 */

'use strict';

let requireDir = require('require-dir');

function init() {
	try {
		requireDir('./');
		return Promise.resolve('Success');
	} catch (ex) {
		return Promise.reject('Failed');
	}
}

module.exports = {
	init
};