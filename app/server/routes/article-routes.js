/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let qs = require('qs');

let articleController = require('../controller/article-controller');

let addArticle = function (req, res) {
	let body = qs.parse(req.body);
	let article = {
		link: body.url,
		userId: body.userId
	};
	articleController.add(article, function (err, item) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			id: item
		});
	});

};

let getArticle = function (req, res) {
	let body = qs.parse(req.body);
	let userId = body.userId;
	articleController.get(userId, function (err, items) {
		if (err) {
			return res.status(500).send({
				msg: err
			});
		}
		res.status(200).send({
			id: item
		});
	})
};


module.exports = {
	addArticle,
	getArticle
};