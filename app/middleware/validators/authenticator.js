/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');

let jwtController = require('../../controllers/jwt-controller');

function authenticate(req, res, next) {
  let token = req.headers.authorization;

  let userId = jwtController.decodeForUid(token);
  if (_.isUndefined(userId)) {
    return res.status(401).send({
      err: 'please login'
    });
  }

  req.uid = userId;
  next();
}

module.exports = authenticate;
