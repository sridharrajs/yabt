/**
 * Created by sridharrajs on 1/13/16.
 */

/**
 * Created by sridharrajs on 1/13/16.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mongoose = require('mongoose');

var db = mongoose;

var ConnectionFactory = function () {
	function ConnectionFactory() {
		_classCallCheck(this, ConnectionFactory);
	}

	_createClass(ConnectionFactory, null, [{
		key: 'connect',
		value: function connect(config) {
			db.connect(config.mongdbUrl);
			return new Promise(function (resolve, reject) {
				db.connection.on('open', function () {
					resolve('Success');
				}).on('error', function (err) {
					reject(err);
				});
			});
		}
	}]);

	return ConnectionFactory;
}();

module.exports = ConnectionFactory;