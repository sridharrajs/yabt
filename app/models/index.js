/**
 * Created by sridharrajs on 1/12/16.
 */

'use strict';

let _ = require('lodash');

let models = [
	'user',
	'article'
];

function init() {
	_.each(models, (model)=> {
		require(`./${model}`);
	});
	return Promise.resolve('Success');
}

module.exports = {
	init
};