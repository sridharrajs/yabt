/**
 * Created by sridharrajs.
 */

'use strict';

function authenticate(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      err: 'please login'
    });
  }

  req.uid = token;
  next();
}

module.exports = authenticate;
