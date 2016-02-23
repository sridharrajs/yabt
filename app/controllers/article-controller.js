/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let async = require('async');
let mongoose = require('mongoose');
let wrapper = require('mongoose-callback-wrapper');

let articleModelSchema = require('../models/article');
let articleModel = mongoose.model('article');

const SCROLL_LIMIT = 10;

function computeSkipCount(pageNo) {
	if (pageNo === 0) {
		return pageNo;
	} else {
		return pageNo * SCROLL_LIMIT;
	}
}

let add = function (article, cb) {
	let item = new articleModel({
		url: article.url,
		userId: article.userId,
		title: article.title,
		tags: article.tag
	});
	item.save((err, newDoc) => {
		if (err) {
			cb(err);
		} else {
			cb(null, newDoc._doc);
		}
	});
};

let addArticles = function (articles, cb) {
	async.forEach(
		articles,
		function (article, callback) {
			let newArticle = new articleModel({
				url: article.url,
				userId: article.userId,
				title: article.title,
				tags: article.tag
			});
			newArticle.save((err) => {
				if (err) {
					return callback(err);
				}
				callback(null, 'success');
			});
		},
		function (err) {
			if (err) {
				return cb(err);
			}
			return cb(null, '+1');
		}
	);
};

let getArticles = function (item, cb) {
	let wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	let query = articleModel
		.find({
			userId: item.userId,
			active: true,
			is_archived: item.archive
		})
		.limit(SCROLL_LIMIT)
		.sort({
			time_added: -1
		})
		.skip(computeSkipCount(item.pageNo));
	query.exec(wrappedCallback);
};

let getActiveCount = (item, cb)=> {
	let wrappedCallback = wrapper.wrap(cb);
	articleModel
		.find({
			userId: item.userId,
			active: true,
			is_archived: false
		}, wrappedCallback);
};

function archive(articleId, cb) {
	let wrappedCallback = wrapper.wrap(cb);
	let query = {
		_id: articleId
	};
	let change = {
		is_archived: true
	};
	let upsert = {
		upsert: false
	};
	articleModel.findOneAndUpdate(query, change, upsert, wrappedCallback);
}

function updateAttributes(item, cb) {
	let wrappedCallback = wrapper.wrap(cb);
	let query = {
		_id: item._id
	};
	let change = item.attributes;
	let upsert = {
		upsert: false
	};
	articleModel.findOneAndUpdate(query, change, upsert, wrappedCallback);
}

function deleteAll(userId, cb) {
	let wrappedCallback = wrapper.wrap(cb);
	let query = {
		userId: userId
	};
	let change = {
		is_fav: false
	};
	let upsert = {
		upsert: false,
		multi: true
	};
	articleModel.update(query, change, upsert, wrappedCallback);
}

module.exports = {
	add,
	archive,
	addArticles,
	getArticles,
	deleteAll,
	getActiveCount,
	updateAttributes
};