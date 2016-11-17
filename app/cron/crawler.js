/**
 * Created by sridharrajs on 7/5/16.
 */

'use strict';

let async = require('async');
let CronJob = require('cron').CronJob;

let config = require('../../config');

let batchController = require('../controllers/batch-controller');
let pageController = require('../controllers/page-controller');
let articleController = require('../controllers/article-controller');

function processSites(batches) {
	async.mapLimit(batches, 5, (batch, callback) => {
		pageController.fetchPage(batch.url).then((article)=> {
			article.userId = batch.userId;
			callback(null, article);
		}).catch((err) => {
			callback(err);
		});
	}, (err, articles) => {
		if (err) {
			return;
		}
		articleController.addArticles(articles);
	});
}

function run() {
	batchController.getRawArticles().then((batches)=> {
		processSites(batches);
	}).catch((err) => {
		console.log('Bulk processing failed', err.stack);
	});
}


try {
	new CronJob(config.freq, () => {
		run();
	}, null, true, 'UTC');
} catch (err) {
	console.log('err', err.stack);

}
