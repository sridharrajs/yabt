/**
 * Created by sridharrajs on 2/5/16.
 */

'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');
let fs = require('fs');
let request = require('request');
let url = require('url');

const RULES_LOCATION = __dirname + '/../rules/rules.json';
const RULES = JSON.parse(fs.readFileSync(RULES_LOCATION, 'UTF-8'));
const SUCCESS_CODES = [200, 201, 301, 302];

let getPageTitle = (pageURL, metaCb)=> {
	let options = {
		url: pageURL,
		headers: {
			'User-Agent': 'Firefox'
		}
	};
	request(options, (err, response, body)=> {
		if (err) {
			metaCb(err.stack);
		}
		if (!_.contains(SUCCESS_CODES, response.statusCode)) {
			metaCb(response.statusCode);
		}
		let $ = cheerio.load(body);
		let title = $('title').text();
		metaCb(null, title);
	});
};

let getTagByDomain = (hostURL)=> {
	let host = url.parse(hostURL).hostname;
	let justName = getNakedDomainName(host);
	let tag = RULES['domain'][justName];
	if (tag) {
		return tag;
	}
	return '';
};

function getNakedDomainName(hostURL) {
	let isWWWPresent = hostURL.indexOf('www.');
	if (isWWWPresent) {
		hostURL = hostURL.replace('www.', '')
	}
	return hostURL;
}

module.exports = {
	getPageTitle,
	getTagByDomain
};



