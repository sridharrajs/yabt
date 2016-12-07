/**
 * Created by sridharrajs on 2/5/16.
 */

'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');

function getTitle($) {
    return $('title').text().trim();
}

function getDescription($) {
    let description = '';
    let meta = $('meta[name=\'description\']') || $('meta[name=\'Description\']');
    if (!_.isEmpty(meta)) {
        meta = meta[0];
        if (!_.isEmpty(meta.attribs)) {
            description = meta.attribs.content;
        }
    }
    return description;
}

function parse(html) {
    let $ = cheerio.load(html);
    let title = getTitle($);
    let description = getDescription($);
    return {
        html,
        title,
        description
    };
}

module.exports = {
    parse
};
