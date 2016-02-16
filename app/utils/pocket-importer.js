/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');
let fs = require('fs');
let path = require('path');

let uploadLocation = path.join(__dirname, '../../uploads');

class Importer {

	static parse(userId) {
		let filename = `${uploadLocation}/${userId}.html`;
		console.log('filename', filename);
		let data = fs.readFileSync(filename, 'utf8');
		let articles = [];
		let $ = cheerio.load(data);
		let rawLinks = $('a[href]');
		_.each(rawLinks, (article)=> {
			let attribute = article.attribs;
			articles.push({
				url: attribute.href,
				time_added: attribute.time_added
			});
		});
		return articles;
	}

}

module.exports = Importer;