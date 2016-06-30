/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let _ = require('lodash');
let async = require('async');
let express = require('express');
let qs = require('qs');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let twitterUtil = require('../utils/twitter-util');

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
	let notes = body.notes;

	if (!url) {
		return res.status(400).send({
			msg: 'Invalid url'
		});
	}

	let article = {
		url,
		userId,
		notes
	};

	async.waterfall([(callback)=> {
		appendPageDetails(userId, [article], callback);
	}, (articles, callback)=> {
		articleController.add(_.first(articles), callback);
	}], (err, items) => {
		if (err) {
			if (err.code === 11000) {
				return res.status(200).send({
					msg: err.msg,
					data: {
						countIncremented: false
					}
				});
			}
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			msg: 'Success',
			data: {
				articles: items,
				countIncremented: true
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

	articleController.getArticles(item).then((articles)=> {
		return res.status(200).send({
			data: {
				articles: articles,
				pageNo: ++pageNo
			}
		});
	}).catch((err) => {
		return res.status(500).send({
			msg: err
		});
	});

}

function importFromPocket(req, res) {
	let userId = req.uid;
	let articles = [];

	articleController.addArticles(articles).then(()=> {
		return res.status(200).send({
			msg: 'all good!',
			data: items
		});
	}).catch((err) => {
		return res.status(500).send({
			msg: err
		});
	});

	async.waterfall([(callback)=> {
		uploadToDir(userId, req, res, callback);
	}, (articles, callback)=> {
		appendPageDetails(userId, articles, callback);
	}, (articles, callback)=> {
		addArticles(articles, callback);
	}], (err, items)=> {
		if (err) {

		}

	});
}

function deleteArticle(req, res) {
	let articleId = req.params.articleId;
	articleController.deleteArticle(articleId).then(()=> {
		return res.status(200).send({
			data: 'Article was deleted'
		});
	}).catch((err) => {
		return res.status(500).send({
			msg: err
		});
	});
}

function deleteAllArticles(req, res) {
	let userId = req.uid;
	articleController.deleteAll(userId).then(()=> {
		res.status(200).send({
			data: 'success'
		});
	}).catch((err) => {
		return res.status(500).send({
			msg: err
		});
	});
}

function importFromTwitter(req, res) {
	let userId = req.uid;
	async.waterfall([(callback)=> {
		twitterUtil.importFavourties(userId, callback);
	}, (articles, callback)=> {
		addArticles(articles, callback);
	}], (err, items) => {
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

	let favourite = body.actions.favourite;
	let archive = body.actions.archive;

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

app.post('/', addArticle)
	.get('/', getArticles);

app.put('/:articleId', updateArticle);
app.post('/import-twitter', importFromTwitter);
app.post('/import-pocket', importFromPocket);

app.delete('/:articleId', deleteArticle);
app.delete('/', deleteAllArticles);

module.exports = app;