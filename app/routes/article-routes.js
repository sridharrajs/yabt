/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let _ = require('lodash');
let qs = require('qs');
let express = require('express');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let pageController = require('../controllers/page-controller');

let crawlController = require('../controllers/crawl-controller');

function addArticle(req, res) {
	let userId = req.uid;
	let body = qs.parse(req.body);
	let url = body.url;
	let notes = '';

	if (!body.notes) {
		notes = body.notes;
	}

	if (!url) {
		return res.status(400).send({
			msg: 'Invalid url'
		});
	}

	crawlController.fetchPage(url).then((article)=> {
		article.userId = userId;
		article.notes = notes;
		return articleController.add(article);
	}).then((newArticle)=> {
		return res.status(200).send({
			msg: 'Success',
			isNew: true,
			article: newArticle
		});
	}).catch((err) => {
		if (err.code === 11000) {
			return res.status(200).send({
				msg: 'Success',
				isNew: false
			});
		}
		return res.status(500).send({
			msg: err.message
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

	let archive = req.query.fetchArchive;
	item.is_archived = !_.isUndefined(archive) && archive === 'true';

	let type = req.query.type;
	if (!_.isUndefined(type)) {
		if (_.includes(type, 'video')) {
			item.is_video = true;
		}
	}

	let isFavourited = req.query.fetchFavourites;
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

function deleteAll(req, res) {
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

	articleController.updateAttributes(article).then((items)=> {
		let msg = 'Success!';
		if (_.isEmpty(items)) {
			msg = 'Nothing was changed';
		}
		res.status(200).send({
			msg: msg
		});
	}).catch((err) => {
		console.log('err', err.stack);
		return res.status(500).send({
			msg: err
		});
	});
}

app.post('/', addArticle)
	.get('/', getArticles);

app.put('/:articleId', updateArticle);

app.delete('/:articleId', deleteArticle);
app.delete('/', deleteAll);

const allowOptions = require('allow-options');
const authFilter = require('../middleware/auth-filter');

module.exports = (indexRoute)=> {
	indexRoute.use('/api/articles', [allowOptions, authFilter], app);
};











