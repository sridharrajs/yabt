/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let _ = require('lodash');
let mongoose = require('mongoose');
let wrapper = require('mongoose-callback-wrapper');

let articleModelSchema = require('../models/article');

let articleModel = mongoose.model('article');

const SCROLL_LIMIT = 10;

let add = function (article, cb) {
	let item = new articleModel({
		url: article.url,
		userId: article.userId
	});
	item.save((err, newDoc) => {
		if (err) {
			cb(err);
		} else {
			cb(null, newDoc._doc);
		}
	});
};

let addArticles = function (item, cb) {
	_.each(item.articles, (article)=> {
		let newArticle = new articleModel({
			url: article.url,
			userId: item.userId
		});
		newArticle.save((err) => {
			if (err) {
				return cb(err);
			}
			cb(null, 'success');
		});
	});
};

let getArticles = function (item, cb) {
	let wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	let query = articleModel
		.find({
			userId: item.userId
		})
		.limit(SCROLL_LIMIT)
		.skip(computeSkipCount(item.pageNo));
	query.exec(wrappedCallback);
};

function computeSkipCount(pageNo) {
	if (pageNo === 0) {
		return pageNo;
	} else {
		return pageNo * SCROLL_LIMIT;
	}
}

module.exports = {
	add,
	addArticles,
	getArticles
};