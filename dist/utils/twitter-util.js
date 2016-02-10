/**
 * Created by sridharrajs.
 */

'use strict';

var _ = require('lodash');
var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {
	screen_name: 'sridharrajs'
};

function importFavourties(userId, cb) {
	client.get('favorites/list', params, function (err, tweets, response) {
		if (err) {
			cb(err);
		}
		var links = [];
		_.each(tweets, function (tweet) {
			links.push({
				userId: userId,
				url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
				title: tweet.text
			});
		});
		return cb(null, links);
	});
}

module.exports = {
	importFavourties: importFavourties
};