/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let articleModelSchema = require('../models/article');
let wrapper = require('../utils/mongoose-callback-wrapper');
let articleModel = mongoose.model('article');

let add = function (article, cb) {
	let item = new articleModel({
		url: article.url,
		userId: article.userId
	});
	item.save(function (err, newDoc) {
		if (!err) {
			cb(null, newDoc);
		} else {
			cb('error');
		}
	});
};

let get = function (userId, cb) {
	let wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	articleModel.find({
		userId: userId
	}, wrappedCallback);
};

module.exports = {
	add,
	get
};