/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let _ = require('lodash');
let url = require('url');
let realurl = require('realurl');

let request = require('request').defaults({
	maxRedirects: 20
});

const QUERY_URLS = [
	'youtube.com',
	'news.ycombinator.com'
];

const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0';

const SUCCESS_CODES = [
	200,
	201,
	301,
	302
];

function makeGET(rawURL) {
	let options = {
		url: santizeURL(rawURL),
		rejectUnauthorized: false,
		headers: {
			'User-Agent': USER_AGENT
		},
		followAllRedirects: true
	};

	return new Promise((resolve, reject) => {
		request(options, (err, response, body)=> {
			if (err) {
				return reject(err.stack);
			}

			if (!_.contains(SUCCESS_CODES, response.statusCode)) {
				return reject(response.statusCode);
			}
			return resolve(body);
		});
	});

}

//https://www.youtube.com/watch?v=yVpbFMhOAwE
//https://news.ycombinator.com/item?id=11467176
function santizeURL(rawURL) {
	_.each(QUERY_URLS, (queryURL) => {
		if (_.includes(rawURL, queryURL)) {
			return Promise.resolve(rawURL);
		}
	});

	return new Promise((resolve, reject) => {
		realurl.get(rawURL, (error, result) => {
			if (err) {
				return reject(error);
			}
			resolve(_.first(result.split('?')));
		});
	});
}

function getHostName(rawURL) {
	return url.parse(rawURL).hostname;
}

module.exports = {
	makeGET,
	getHostName
};
