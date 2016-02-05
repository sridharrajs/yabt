/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let express = require('express');
let qs = require('qs');

let app = express.Router();

let articleController = require('../controller/article-controller');
let pocketImporter = require('../utils/pocket-importer');

app.post('/',function (req, res) {
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
			id: item
		});
	});

});

app.get('/',function (req, res) {
	let userId = req.uid;
	articleController.getArticles(userId, (err, items) => {
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

app.post('/import-pocket',function (req, res) {
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