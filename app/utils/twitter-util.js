/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');
const Twitter = require('twitter');

const client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const params = {
	screen_name: 'sridharrajs'
};

function importFavourties(userId, cb) {
	client.get('favorites/list', params, (err, tweets, response) => {
		if (err || _.isUndefined(response)) {
			cb(err);
		}
		let links = [];
		_.each(tweets, (tweet)=> {
			links.push({
				userId: userId,
				url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
				title: tweet.text
			});
		});
		return cb(null, links);
	});
}

module.exports = {
	importFavourties
};