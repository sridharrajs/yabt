/**
 * Created by sridharrajs on 2/5/16.
 */

'use strict';

let _ = require('lodash');
let _s = require('underscore.string');
let cheerio = require('cheerio');
let fs = require('fs');
let request = require('request').defaults({
	maxRedirects: 20
});
let url = require('url');

const RULES_LOCATION = __dirname + '/../rules/rules.json';
const RULES = JSON.parse(fs.readFileSync(RULES_LOCATION, 'UTF-8'));
const SUCCESS_CODES = [200, 201, 301, 302];
const DOMAIN_TAG = RULES.domain;
const DOMAINS = _.keys(DOMAIN_TAG);
const TAGS = _.values(DOMAIN_TAG);

let getPageTitle = (pageURL, metaCb)=> {
	let options = {
		url: pageURL,
		rejectUnauthorized: false,
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0'
		}
	};
	request(options, (err, response, body)=> {
		if (err) {
			return metaCb(err.stack);
		}
		if (!_.contains(SUCCESS_CODES, response.statusCode)) {
			return metaCb(response.statusCode);
		}
		let $ = cheerio.load(body);
		let title = $('title').text();
		metaCb(null, title);
	});
};

let getTagByDomain = (hostURL)=> {
	let host = url.parse(hostURL).hostname;
	let tag = '';
	_.each(DOMAINS, (domain)=> {
		if (_s.include(host, domain)) {
			tag = DOMAIN_TAG[domain];
			return;
		}
	});
	return tag;
};

let getTags = ()=> {
	return TAGS;
};

module.exports = {
	getPageTitle,
	getTagByDomain,
	getTags
};
