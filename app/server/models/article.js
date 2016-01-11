/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
	url: {
		type: 'String',
		required: true
	},
	userId: {
		type: 'String',
		required: true
	},
	tags: [String]
});

mongoose.model('article', schema);

const ATTRIBUTES = [
	'url',
	'tags',
	'userId'
];

function getAttributes() {
	return ATTRIBUTES;
}

module.exports = {
	getAttributes
};
