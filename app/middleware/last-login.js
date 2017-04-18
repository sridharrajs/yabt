/**
 * Created by sridharrajs on 6/28/16.
 */

'use strict';

let userController = require('../controllers/user-controller');

function update(req, res, next) {
  let userId = req.uid;
  userController.updateLastSeen(userId).then(() => {
    next();
  });
}

module.exports = update;
