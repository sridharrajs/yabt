/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let urlUtils = require('../utils/url-utils');
var read = require('read-art');

class CrawlController {

	static fetchPage(rawURL) {
		return urlUtils.sanitizeWithPromise(rawURL).then((url)=> {
			return new Promise((resolve, reject)=> {
				read(url, (err, art) => {
					if (err) {
						return reject(err);
					}
					let host = urlUtils.getHostName(url);
					return resolve({
						title: art.title,
						url: url,
						content: art.content,
						description: 'description',
						host: host,
						isVideo: urlUtils.isVideo(host)
					});
				});
			});
		});
	}

}

module.exports = CrawlController;
