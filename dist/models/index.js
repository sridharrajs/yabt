/**
 * Created by sridharrajs on 1/12/16.
 */

'use strict';

var _ = require('lodash');

var models = ['user', 'article'];

function init() {
	_.each(models, function (model) {
		require('./' + model);
	});
	return Promise.resolve('Success');
}

module.exports = {
	init: init
};