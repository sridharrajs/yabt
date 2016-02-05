/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
	url: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: false
	},
	is_fav: {
		type: Boolean,
		default: false
	},
	time_added: {
		type: Number,
		default: Date.now()
	},
	tags: [String]
});

mongoose.model('article', schema);

const ATTRIBUTES = [
	'url',
	'tags',
	'userId',
	'is_fav',
	'title',
	'time_added'
];

function getAttributes() {
	return ATTRIBUTES;
}

module.exports = {
	getAttributes
};
