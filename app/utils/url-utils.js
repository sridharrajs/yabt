/**
 * Created by sridharrajs on 9/6/16.
 */

'use strict';

let _ = require('lodash');
let url = require('url');
let realurl = require('realurl');

const QUERY_URL_DOMAINS = [
	'youtube.com',
	'news.ycombinator.com'
];

const VIDEO_DOMAINS = [
	'youtube.com',
	'www.youtube.com',
        'ted.com',
    'vimeo.com',
    'www.vimeo.com'
];

class UrlUtils {

	static sanitizeWithPromise(rawURL) {
		for (let domains of QUERY_URL_DOMAINS) {
			if (_.includes(rawURL, domains)) {
				return Promise.resolve(rawURL);
			}
		}

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

	static isVideo(host) {
		return _.includes(VIDEO_DOMAINS, host);
	}

}

module.exports = UrlUtils;
