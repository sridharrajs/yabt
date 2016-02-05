/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let _ = require('lodash');
let express = require('express');
let qs = require('qs');

let app = express.Router();

let articleController = require('../controllers/article-controller');
let pocketImporter = require('../utils/pocket-importer');

app
	.post('/', (req, res) => {
		let userId = req.uid;
		let body = qs.parse(req.body);
		let article = {
			url: body.url,
			userId: userId
		};
		articleController.add(article, (err, item) => {
			if (err) {
				return res.status(500).send({
					msg: err
				});
			}
			res.status(200).send({
				data: {
					articles: item
				}
			});
		});

	})
	.get('/', (req, res) => {
		let userId = req.uid;
		articleController.getArticles(userId, (err, items) => {
			if (err) {
				return res.status(500).send({
					msg: err
				});
			}
			if (_.isEmpty(items)) {
				items = [];
			}
			res.status(200).send({
				id: items
			});
		});
	});

app.post('/import-pocket', (req, res) => {
	let userId = req.uid;
	let articles = pocketImporter.parse(userId);

	articleController.getArticles({
		articles,
		userId
	}, (err, items) => {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			id: items
		});
	});
});

module.exports = app;