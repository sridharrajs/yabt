/**
 * Created by sridharrajs on 7/4/16.
 */

'use strict';

let mongoose = require('mongoose');
let Batch = mongoose.model('batch');

class BatchController {

  static getRawArticles() {
    return Batch.find({
      error_count: {
        $lte: 3
      }
    }).limit(5).exec();
  }

}

module.exports = BatchController;
