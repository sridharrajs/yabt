/**
 * Created by sridharrajs on 7/4/16.
 */

'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let Batch = mongoose.model('batch');

class BatchController {

	static addAll(articles) {
		let bulkTransaction = Batch.collection.initializeUnorderedBulkOp();

		_.each(articles, (article) => {
			bulkTransaction.insert({
				userId: article.userId,
				url: article.url,
				time_added: article.time_added
			});
		});

		return bulkTransaction.execute().catch((err) => {
			console.log('err.stack', err.stack);
			return Promise.reject(err);
		});

	}

	static getRawArticles() {
		return Batch.find({
			error_count: {
				$lte: 3
			}
		}).limit(5).exec();
	}

}


module.exports = BatchController;