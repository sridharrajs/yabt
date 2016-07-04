/**
 * Created by sridharrajs on 2/5/16.
 */

'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');
let fs = require('fs');

function parse(html) {
	let $ = cheerio.load(html);
	let title = getTitle($);
	let description = getDescription($);
	return {
		title,
		description
	};
}

function getTitle($) {
	return $('title').text().trim()
}

function getDescription($) {
	let description = '';
	let meta = $('meta[name=\'description\']');
	if (!_.isEmpty(meta)) {
		meta = meta[0];
		description = meta.attribs.content;
	}
	if (!description) {
		meta = $('meta[name=\'Description\']');
		if (!_.isEmpty(meta)) {
			meta = meta[0];
		}
	}
	description = meta.attribs.content;
	return description;
}

module.exports = {
	parse
};
