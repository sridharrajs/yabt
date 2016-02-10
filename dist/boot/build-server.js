/**
 * Created by sridharrajs.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var https = require('https');
var http = require('http');

var application = require('../application');

function getServerByProtocol(config, app) {
	if (config.secure) {
		return https.createServer(config.options, app);
	}
	return http.createServer(app);
}

var Server = function () {
	function Server() {
		_classCallCheck(this, Server);
	}

	_createClass(Server, null, [{
		key: 'start',
		value: function start(config) {
			var server = getServerByProtocol(config, application.getApp());
			return new Promise(function (resolve, reject) {
				server.listen(config.port, function () {
					resolve('success');
				}).on('error', function (err) {
					reject(err);
				});
			});
		}
	}]);

	return Server;
}();

module.exports = Server;