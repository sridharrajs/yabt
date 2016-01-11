/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
	link: {
		type: 'String',
		required: true
	},
	tags: [String]
});

mongoose.model('article', schema);