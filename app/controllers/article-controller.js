/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let Article = mongoose.model('article');

class ArticleController {

	static add(article) {
		let item = new Article({
			url: article.url,
			userId: article.userId,
			title: article.title,
			description: article.description,
			host: article.host,
			notes: article.notes
		});
		return item.save().catch((err) => {
			if (err.code === 11000) {
				return Promise.resolve({
					msg: 'Article already saved'
				});
			}
		});
	}

	static addArticles(articles) {
		let bulkTransaction = Article.collection.initializeUnorderedBulkOp();

		_.each(articles, (article) => {
			bulkTransaction.insert({
				url: article.url,
				userId: article.userId,
				title: article.title,
				description: article.description,
				tags: article.tag,
				host: article.host
			});
		});

		return bulkTransaction.execute().catch((err) => {
			console.log('err.stack', err.stack);
			return Promise.reject(err);
		});

	}

	static getArticles(item) {
		return Article.find(item).sort({
			time_added: -1
		}).exec();
	}

	static getActiveCount(item) {
		return Article.find({
			userId: item.userId,
			active: true,
			is_archived: false
		}).exec();
	}

	static archive(articleId) {
		return Article.findOneAndUpdate({
			_id: articleId
		}, {
			is_archived: true
		}, {
			upsert: false
		}).exec();
	}

	static deleteArticle(articleId) {
		return Article.findOneAndRemove({
			_id: articleId
		}).exec();
	}

	static updateAttributes(item) {
		return Article.findOneAndUpdate({
			_id: item._id
		}, item.attributes, {
			upsert: false
		}).exec();
	}

	static deleteAll(userId) {
		return Article.update({
			userId: userId
		}, {
			is_fav: false
		}, {
			upsert: false,
			multi: true
		}).exec();
	}


}

module.exports = ArticleController;