/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let _ = require('lodash');
let async = require('async');
let express = require('express');
let qs = require('qs');

var multer = require('multer');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let pocketImporter = require('../utils/pocket-importer');
let pageUtil = require('../utils/page-utils');
let twitterUtil = require('../utils/twitter-util');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './uploads');
	},
	filename: (req, file, callback) => {
		callback(null, `${req.uid}.html`);
	}
});

const upload = multer({
	storage: storage
}).single('file');

function uploadToDir(userId, req, res, callback) {
	upload(req, res, (err) => {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}

		let articles = pocketImporter.parse(userId);
		if (_.isEmpty(articles)) {
			return res.status(200).send({
				msg: 'empty articles'
			});
		}
		callback(null, articles);
	});
}

function appendPageDetails(userId, articles, callback) {
	async.mapLimit(articles, 9,
		(article, detailsCb)=> {
			pageUtil.getDetails(article.url, (err, details) => {
				if (err) {
					return detailsCb(null, '');
				}
				if (err) {
					return detailsCb(err, null);
				}
				article.title = details.title;
				article.tag = details.tag;
				article.description = details.description;
				article.isVideo = details.isVideo;
				article.url = details.sanitizedURL;
				article.userId = userId;
				detailsCb(null, article);
			});
		},
		(err, acb)=> {
			if (err) {
				return callback(err);
			}
			acb = _.reject(acb, site => _.isEmpty(site));
			callback(null, acb);
		});
}

function addArticles(articles, callback) {
	articleController.addArticles(articles, (err, items) => {
		if (err) {
			return callback(err);
		}
		callback(null, items);
	});
}

function addArticle(req, res) {
	let userId = req.uid;
	let body = qs.parse(req.body);
	let url = body.url;

	if (!url) {
		return res.status(400).send({
			msg: 'Invalid url'
		});
	}

	let article = {
		url,
		userId
	};

	async.waterfall([
		(callback)=> {
			appendPageDetails(userId, [article], callback);
		},
		(articles, callback)=> {
			articleController.add(_.first(articles), callback);
		}
	], (err, items) => {
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
}

function getArticles(req, res) {
	let userId = req.uid;
	let pageNo = req.query.page;

	let item = { //db columns
		userId,
		active: true
	};

	let archive = req.query.archive;
	if (!_.isUndefined(archive) && archive === 'true') {
		item.is_archived = true;
	} else {
		item.is_archived = false;
	}

	let type = req.query.type;
	if (!_.isUndefined(type)) {
		if (_.contains(type, 'video')) {
			item.is_video = true;
		}
	}

	let isFavourited = req.query.favourites;
	if (!_.isUndefined(isFavourited) && isFavourited === 'true') {
		item.is_fav = true;
		delete item.is_archived;
	}

	articleController.getArticles(item, pageNo, (err, items) => {
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
				pageNo: ++pageNo
			}
		});
	});
}

function importFromPocket(req, res) {
	let userId = req.uid;
	async.waterfall([
		(callback)=> {
			uploadToDir(userId, req, res, callback);
		},
		(articles, callback)=> {
			appendPageDetails(userId, articles, callback);
		},
		(articles, callback)=> {
			addArticles(articles, callback);
		}
	], (err, items)=> {
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
}

function deleteArticle(req, res) {
	let articleId = req.params.articleId;
	articleController.deleteArticle(articleId, (err, items) => {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		let msg = 'Article was deleted';
		if (_.isEmpty(items)) {
			msg = 'Nothing was changed';
		}
		res.status(200).send({
			data: msg
		});
	});
}

function deleteAllArticles(req, res) {
	let userId = req.uid;
	articleController.deleteAll(userId, (err, items) => {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		let msg = 'Article was deleted';
		if (_.isEmpty(items)) {
			msg = 'Nothing was changed';
		}
		res.status(200).send({
			data: msg
		});
	});
}

function importFromTwitter(req, res) {
	let userId = req.uid;
	async.waterfall([
		(callback)=> {
			twitterUtil.importFavourties(userId, callback);
		},
		(articles, callback)=> {
			addArticles(articles, callback);
		}
	], (err, items) => {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			data: items
		});
	});

}

function updateArticle(req, res) {
	let body = qs.parse(req.body);
	let actions = body.actions;
	let favourite = actions.favourite;
	let archive = actions.archive;

	let article = {
		_id: req.params.articleId,
		attributes: {}
	};

	if (!_.isUndefined(favourite)) {
		article.attributes.is_fav = favourite;
	}

	if (!_.isUndefined(archive)) {
		article.attributes.is_archived = archive;
	}

	articleController.updateAttributes(article, (err, items) => {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		let msg = 'Success!';
		if (_.isEmpty(items)) {
			msg = 'Nothing was changed';
		}
		res.status(200).send({
			msg: msg
		});
	});

}

app
	.post('/', addArticle)
	.get('/', getArticles);

app.put('/:articleId', updateArticle);
app.post('/import-twitter', importFromTwitter);
app.post('/import-pocket', importFromPocket);

app.delete('/:articleId', deleteArticle);
app.delete('/', deleteAllArticles);

module.exports = app;