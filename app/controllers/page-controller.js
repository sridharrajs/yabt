/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let async = require('async');

let pageUtil = require('../utils/page-utils');

function appendPageDetails(userId, articles, callback) {
	async.mapLimit(articles, 9, (article, detailsCb)=> {
		pageUtil.getDetails(article.url, (err, details) => {
			if (err) {
				return detailsCb(err, null);
			}
			article.title = details.title;
			article.tag = details.tag;
			article.description = details.description;
			article.isVideo = details.isVideo;
			article.url = details.sanitizedURL;
			article.userId = userId;
			article.host = details.host;
			detailsCb(null, article);
		});
	}, (err, acb)=> {
		if (err) {
			return callback(err);
		}
		acb = _.reject(acb, site => _.isEmpty(site));
		callback(null, acb);
	});
}