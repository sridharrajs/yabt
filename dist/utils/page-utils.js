/**
 * Created by sridharrajs on 2/5/16.
 */

'use strict';

var _ = require('lodash');
var _s = require("underscore.string");
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request').defaults({
	maxRedirects: 20
});
var url = require('url');

var RULES_LOCATION = __dirname + '/../rules/rules.json';
var RULES = JSON.parse(fs.readFileSync(RULES_LOCATION, 'UTF-8'));
var SUCCESS_CODES = [200, 201, 301, 302];
var DOMAINS = _.keys(RULES['domain']);
var TAGS = _.values(RULES['domain']);

var getPageTitle = function getPageTitle(pageURL, metaCb) {
	var options = {
		url: pageURL,
		rejectUnauthorized: false,
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0'
		}
	};
	request(options, function (err, response, body) {
		if (err) {
			return metaCb(err.stack);
		}
		if (!_.contains(SUCCESS_CODES, response.statusCode)) {
			return metaCb(response.statusCode);
		}
		var $ = cheerio.load(body);
		var title = $('title').text();
		metaCb(null, title);
	});
};

var getTagByDomain = function getTagByDomain(hostURL) {
	var host = url.parse(hostURL).hostname;
	var tag = '';
	_.each(DOMAINS, function (domain) {
		if (_s.include(host, domain)) {
			tag = DOMAINS[domain];
			return;
		}
	});
	return tag;
};

var getTags = function getTags() {
	return TAGS;
};

module.exports = {
	getPageTitle: getPageTitle,
	getTagByDomain: getTagByDomain,
	getTags: getTags
};