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

function appendPageTitle(userId, articles, callback) {
	async
		.mapLimit(
			articles,
			9,
			(article, titleCb)=> {
				let url = article.url;
				pageUtil.getPageTitle(url, (err, title) => {
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
			},
			(err, acb)=> {
				if (err) {
					return callback(err);
				}
				acb = _.reject(acb, (site)=> {
					return _.isEmpty(site);
				});
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
		url: url,
		userId: userId
	};

	async.waterfall([
		(callback)=> {
			appendPageTitle(userId, [article], callback);
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
	let archive = req.query.archived;
	if (!pageNo || pageNo <= 0) {
		pageNo = 0;
	}

	let item = {
		archive: false,
		userId,
		pageNo
	};

	if (!_.isUndefined(archive)) {
		item.archive = true;
	}

	articleController.getArticles(item, (err, items) => {
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

app.post('/import-pocket', (req, res) => {
	let userId = req.uid;

	async
		.waterfall([
			(callback)=> {
				upload(req, res, (err) => {
					if (err) {
						console.log(req.file);
						console.log(err);
						return res.status(500).send({
							msg: 'Error uploading file.'
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
			},
			(articles, callback)=> {
				appendPageTitle(userId, articles, callback);
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

});

app.delete('/:articleId', (req, res)=> {
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
});

app.delete('/', (req, res)=> {
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
});

app.post('/import-twitter', (req, res)=> {
	let userId = req.uid;
	async
		.waterfall([
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

});

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

module.exports = app;