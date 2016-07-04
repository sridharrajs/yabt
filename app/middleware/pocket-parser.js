/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');
let fs = require('fs');
let path = require('path');

let uploadLocation = path.join(__dirname, '../../uploads');

function importer(req, res, next) {
	let userId = req.uid;
	let filename = `${uploadLocation}/${userId}.html`;
	let data = fs.readFileSync(filename, 'utf8');
	let articles = [];
	let $ = cheerio.load(data);

	_.each($('a[href]'), (article)=> {
		let attribute = article.attribs;
		articles.push({
			url: attribute.href,
			time_added: attribute.time_added
		});
	});
	req.articles = articles;
	next();
}

module.exports = importer;