/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let responseUtils = require('./response-utils');

let request = require('request').defaults({
  maxRedirects: 20
});

const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0';

function makeGET(rawURL) {
  let options = {
    url: rawURL,
    rejectUnauthorized: false,
    headers: {
      'User-Agent': USER_AGENT
    },
    followAllRedirects: true
  };

  return new Promise((resolve, reject)=> {
    request(options, (err, response, body)=> {
      if (err) {
        return reject(err.stack);
      }

      if (responseUtils.isFailure(response)) {
        let statusCode = responseUtils.extractStatusCode(response);
        return reject(new Error(`Status of the request to the page resulted in ${statusCode}`));
      }
      return resolve(body);
    });
  });

}

module.exports = {
  makeGET
};
