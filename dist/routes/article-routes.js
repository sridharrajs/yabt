/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var express = require('express');
var qs = require('qs');

var app = express.Router();

var articleController = require('../controllers/article-controller');
var pocketImporter = require('../utils/pocket-importer');
var pageUtil = require('../utils/page-utils');
var twitterUtil = require('../utils/twitter-util');

app.post('/', function (req, res) {
	var userId = req.uid;
	var body = qs.parse(req.body);
	var article = {
		url: body.url,
		userId: userId
	};

	async.waterfall([function (callback) {
		appendPageTitle(userId, [article], callback);
	}, function (articles, callback) {
		articleController.add(_.first(articles), callback);
	}], function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			data: {
				articles: items
			}
		});
	});
}).get('/', function (req, res) {
	var userId = req.uid;
	var pageNo = req.query.page;
	if (!pageNo) {
		pageNo = 0;
	}
	articleController.getArticles({
		userId: userId,
		pageNo: pageNo
	}, function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		if (_.isEmpty(items)) {
			items = [];
		}
		res.status(200).send({
			data: {
				articles: items,
				nextPage: ++pageNo
			}
		});
	});
});

app.post('/import-pocket', function (req, res) {
	var userId = req.uid;
	var articles = pocketImporter.parse(userId);

	if (_.isEmpty(articles)) {
		return res.status(200).send({
			msg: 'empty articles'
		});
	}

	async.waterfall([function (callback) {
		appendPageTitle(userId, articles, callback);
	}, function (articles, callback) {
		addArticles(articles, callback);
	}], function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		return res.status(200).send({
			msg: 'all good!',
			data: items
		});
	});
});

app.delete('/:articleId', function (req, res) {
	var articleId = req.params.articleId;
	articleController.deleteArticle(articleId, function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			data: '+111'
		});
	});
});

app.post('/import-twitter', function (req, res) {
	var userId = req.uid;
	async.waterfall([function (callback) {
		twitterUtil.importFavourties(userId, callback);
	}, function (articles, callback) {
		addArticles(articles, callback);
	}], function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			data: items
		});
	});
});

function appendPageTitle(userId, articles, callback) {
	async.mapLimit(articles, 9, function (article, titleCb) {
		var url = article.url;
		pageUtil.getPageTitle(url, function (err, title) {
			if (err) {
				return titleCb(null, '');
			}
			if (err) {
				return titleCb(err, null);
			}
			article.title = title.trim();
			article.tag = pageUtil.getTagByDomain(url);
			article.userId = userId;
			titleCb(null, article);
		});
	}, function (err, acb) {
		if (err) {
			return callback(err);
		}
		acb = _.reject(acb, function (site) {
			return _.isEmpty(site);
		});
		callback(null, acb);
	});
}

function addArticles(articles, callback) {
	articleController.addArticles(articles, function (err, items) {
		if (err) {
			return callback(err);
		}
		callback(null, items);
	});
}

module.exports = app;