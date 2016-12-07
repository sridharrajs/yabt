/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');

function authenticate(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({
            err: 'please login'
        });
    }

    //db call here

    req.uid = token;
    next();
}

module.exports = authenticate;
