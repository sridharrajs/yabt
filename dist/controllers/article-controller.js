/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var wrapper = require('mongoose-callback-wrapper');

var articleModelSchema = require('../models/article');
var articleModel = mongoose.model('article');

var SCROLL_LIMIT = 10;

var add = function add(article, cb) {
	var item = new articleModel({
		url: article.url,
		userId: article.userId,
		title: article.title,
		tags: article.tag
	});
	item.save(function (err, newDoc) {
		if (err) {
			cb(err);
		} else {
			cb(null, newDoc._doc);
		}
	});
};

var addArticles = function addArticles(articles, cb) {
	async.forEach(articles, function (article, callback) {
		var newArticle = new articleModel({
			url: article.url,
			userId: article.userId,
			title: article.title,
			tags: article.tag
		});
		newArticle.save(function (err) {
			if (err) {
				return callback(err);
			}
			callback(null, 'success');
		});
	}, function (err) {
		if (err) {
			return cb(err);
		}
		return cb(null, '+1');
	});
};

var getArticles = function getArticles(item, cb) {
	var wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	var query = articleModel.find({
		userId: item.userId,
		active: true
	}).limit(SCROLL_LIMIT).sort({
		time_added: -1
	}).skip(computeSkipCount(item.pageNo));
	query.exec(wrappedCallback);
};

var getArticleCount = function getArticleCount(item, cb) {
	var wrappedCallback = wrapper.wrap(cb);
	articleModel.count({
		userId: item.userId,
		active: true
	}, wrappedCallback);
};

function computeSkipCount(pageNo) {
	if (pageNo === 0) {
		return pageNo;
	} else {
		return pageNo * SCROLL_LIMIT;
	}
}

function deleteArticle(articleId, cb) {
	var wrappedCallback = wrapper.wrap(cb);
	var query = {
		_id: articleId
	};
	var change = {
		active: false
	};
	var upsert = {
		upsert: false
	};
	articleModel.findOneAndUpdate(query, change, upsert, wrappedCallback);
}

module.exports = {
	add: add,
	addArticles: addArticles,
	getArticles: getArticles,
	deleteArticle: deleteArticle,
	getArticleCount: getArticleCount
};