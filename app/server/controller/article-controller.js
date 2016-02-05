/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let mongoose = require('mongoose');

let articleModelSchema = require('../models/article');
let wrapper = require('mongoose-callback-wrapper');
let articleModel = mongoose.model('article');

let add = function (article, cb) {
	let item = new articleModel({
		url: article.url,
		userId: article.userId
	});
	item.save((err, newDoc) => {
		if (!err) {
			cb(null, newDoc._doc);
		} else {
			cb(err);
		}
	});
};

let addArticles = function (item, cb) {
	_.each(item.articles, (article)=> {
		let item = new articleModel({
			url: article.url,
			userId: item.userId
		});
		item.save((err) => {
			if (err) {
				return cb(err);
			}
		});
	});
};

let getArticles = function (userId, cb) {
	let wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	articleModel.find({
		userId: userId
	}, wrappedCallback);
};

module.exports = {
	add,
	addArticles,
	getArticles
};