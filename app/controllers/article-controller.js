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
      user_id: article.userId,
      title: article.title,
      description: article.description,
      host: article.host,
      is_video: article.isVideo,
      content: article.content
    });
    return item.save();
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
    return Article.find({
      user_id: item.userId,
      is_active: true
    }).sort({
      time_added: -1
    }).limit(100).exec();
  }

  static getActiveCount(userId) {
    return Article.count({
      user_id: userId,
      is_active: true,
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
      user_id: userId
    }, {
      is_fav: false
    }, {
      upsert: false,
      multi: true
    }).exec();
  }

}

module.exports = ArticleController;
