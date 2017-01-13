/**
 * Created by sridharrajs on 1/6/16.
 */

'use strict';

let fs = require('fs');

class Config {

  static init(HOST_ENVIRONMENT) {
    this.secret = process.env.MY_SECRET;
    let settings = JSON.parse(fs.readFileSync(`./env/${HOST_ENVIRONMENT}.json`, 'utf-8'));

    this.defaultArticle = settings.default_url;
    this.port = settings.port;
    this.secure = settings.secure;
    this.mongdbUrl = settings.mongodb_url;
    this.freq = settings.crawlerFreq;
    return Promise.resolve('Success');
  }

}

module.exports = Config;
