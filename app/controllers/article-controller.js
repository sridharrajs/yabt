/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let async = require('async');
let mongoose = require('mongoose');
let wrapper = require('mongoose-callback-wrapper');

let articleModelSchema = require('../models/article');
let articleModel = mongoose.model('article');

let add = function (article, cb) {
	let item = new articleModel({
		url: article.url,
		userId: article.userId,
		title: article.title,
		description: article.description,
		tags: article.tag,
		is_video: article.isVideo,
		host: article.host
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
	async.forEach(articles, (article, callback) => {
			let newArticle = new articleModel({
				url: article.url,
				userId: article.userId,
				title: article.title,
				description: article.description,
				tags: article.tag,
				host: article.host
			});
			newArticle.save((err) => {
				if (err) {
					return callback(err);
				}
				callback(null, 'success');
			});
		}, (err) => {
			if (err) {
				return cb(err);
			}
			return cb(null, '+1');
		}
	);
};

let getArticles = function (item, pageNo, cb) {
	let wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	let query = articleModel.find(item).sort({
		time_added: -1
	});
	query.exec(wrappedCallback);
};

let getActiveCount = (item, cb)=> {
	let wrappedCallback = wrapper.wrap(cb);
	articleModel.find({
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

function deleteArticle(articleId, cb) {
	let wrappedCallback = wrapper.wrap(cb);
	let query = {
		_id: articleId
	};
	let change = {
		active: false
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
	deleteArticle,
	deleteAll,
	getActiveCount,
	updateAttributes
};