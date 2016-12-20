/**
 * Created by sridharrajs on 9/6/16.
 */

'use strict';

let _ = require('lodash');
let url = require('url');
let realurl = require('realurl');

const QUERY_URL_DOMAINS = [
  'youtube.com',
  'news.ycombinator.com',
  'folklore.org'
];

const URL_SHORTERNS = [
  'bit.ly',
  'buff.ly',
  't.co'
];

const VIDEO_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'ted.com',
  'vimeo.com',
  'www.vimeo.com'
];

class UrlUtils {

  static trimQueryParameter(rawURL) {
    let hostName = this.getHostName(rawURL);
    let isQueryDomain = _.includes(QUERY_URL_DOMAINS, hostName);
    if (isQueryDomain) {
      return rawURL;
    }
    if (_.includes(rawURL, 'medium.com/m/global-identity?redirectUrl=')) {
      return rawURL.split('medium.com/m/global-identity?redirectUrl=')[1];
    }
    return _.first(rawURL.split('?'));
  }

  static sanitizeWithPromise(rawURL) {
    let hostName = this.getHostName(rawURL);

    let isShortLink = _.includes(URL_SHORTERNS, hostName);
    if (!isShortLink) {
      return Promise.resolve(this.trimQueryParameter(rawURL));
    }

    return new Promise((resolve, reject) => {
      realurl.get(rawURL, (error, longUrl) => {
        if (error) {
          return reject(error);
        }
        resolve(longUrl);
      });
    }).then((longUrl)=> {
      return Promise.resolve(this.trimQueryParameter(longUrl));
    });
  }

  static getHostName(rawURL) {
    return url.parse(rawURL).hostname;
  }

  static isVideo(host) {
    return _.includes(VIDEO_DOMAINS, host);
  }

}

module.exports = UrlUtils;
