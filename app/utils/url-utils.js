/**
 * Created by sridharrajs on 9/6/16.
 */

'use strict';

let _ = require('lodash');
let url = require('url');
let realurl = require('realurl');

const QUERY_URLS = [
	'youtube.com',
	'news.ycombinator.com'
];

class UrlUtils {

	//https://www.youtube.com/watch?v=yVpbFMhOAwE
	//https://news.ycombinator.com/item?id=11467176
	static sanitizeWithPromise(rawURL) {
		_.each(QUERY_URLS, (queryURL) => {
			if (_.includes(rawURL, queryURL)) {
				return Promise.resolve(rawURL);
			}
		});

		return new Promise((resolve, reject) => {
			realurl.get(rawURL, (error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(_.first(result.split('?')));
			});
		});
	}

	static getHostName(rawURL) {
		return url.parse(rawURL).hostname;
	}


}

module.exports = UrlUtils;