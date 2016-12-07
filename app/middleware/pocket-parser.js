/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');
let fs = require('fs');
let path = require('path');

let uploadLocation = path.join(__dirname, '../../uploads');

function readFileContent(userId) {
    let filename = `${uploadLocation}/${userId}.html`;
    return fs.readFileSync(filename, 'utf8');
}

function importer(req, res, next) {
    let userId = req.uid;
    let content = readFileContent(userId);

    let articles = [];
    let $ = cheerio.load(content);

    _.each($('a[href]'), (article)=> {
        let attribute = article.attribs;
        articles.push({
            url: attribute.href,
            time_added: attribute.time_added,
            userId: userId
        });
    });
    req.articles = articles;
    next();
}

module.exports = importer;
