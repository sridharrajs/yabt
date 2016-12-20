/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let urlUtils = require('../utils/url-utils');
let pageUtil = require('../utils/page-utils');
let networkUtils = require('../utils/network-utils');

class PageController {

  static fetchPage(rawURL) {
    let url = '';
    return urlUtils.sanitizeWithPromise(rawURL).then((readableURL)=> {
      url = readableURL;
      return networkUtils.makeGET(readableURL);
    }).then((html)=> {
      return pageUtil.parse(html);
    }).then((article)=> {
      article.url = url;
      let host = urlUtils.getHostName(url);
      article.host = host;
      article.isVideo = urlUtils.isVideo(host);
      return Promise.resolve(article);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

}

module.exports = PageController;
