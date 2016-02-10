/**
 * Created by sridharrajs.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');

var Importer = function () {
	function Importer() {
		_classCallCheck(this, Importer);
	}

	_createClass(Importer, null, [{
		key: 'parse',
		value: function parse(userId) {
			var filename = __dirname + ('/' + userId + '.html');
			var data = fs.readFileSync(filename, 'utf8');
			var articles = [];
			var $ = cheerio.load(data);
			var rawLinks = $('a[href]');
			_.each(rawLinks, function (article) {
				var attribute = article.attribs;
				articles.push({
					url: attribute.href,
					time_added: attribute.time_added
				});
			});
			return articles;
		}
	}]);

	return Importer;
}();

module.exports = Importer;