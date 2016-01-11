/**
 * Created by sridharrajs on 1/11/16.
 */


'use strict';

let _ = require('lodash');

let wrap = function (callback, attributes) {
	return function (err, rawItems) {
		if (err) {
			return callback(err, null);
		}
		let items = _.map(rawItems, function (row) {
			return _.pick(row, attributes);
		});
		return callback(null, items);
	};
};

module.exports = {
	wrap
};