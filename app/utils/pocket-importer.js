/**
 * Created by sridharrajs.
 */

'use strict';

let cheerio = require('cheerio');
let fs = require('fs');
let _ = require('lodash');

var pocket = require('pocket-api');
var consumer_key = '51397-9ad2fd7f6cf06ee03c44c3cc';
var request_token = 'a13f47db-2dca-1eef-d955-97db4e';

//pocket.getRequestToken(consumer_key, function (data) {
//	console.log(data);
//	//returns request_token
//});

//pocket.getAccessToken(consumer_key, request_token, function (data) {
//	console.log('data  ', data);
//	//returns username and access_token
//});

class Importer {

	static parse(userId) {
		let filename = __dirname + `/${userId}.html`;
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