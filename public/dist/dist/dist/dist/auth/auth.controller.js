'use strict';

var _auth = require('./auth.service');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

angular.module('readLater').controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ["Auth", "$log", "$state"];

function AuthCtrl(Auth, $log, $state) {
	var self = this;

	self.login = login;
	self.register = register;

	self.user = {
		emailId: '',
		password: ''
	};

	function login(isValid) {
		if (!isValid) {
			return;
		}
		Auth.login(self.user).then(function (data) {
			$log.info("Auth Successful");
			$state.go('home');
		}).catch(function (error) {
			$log.error(error);
		});
	}

	function register(isValid) {
		if (!isValid) {
			return;
		}
		Auth.signup(self.user).then(function (data) {
			$log.info("registeration Successful");
			$state.go('home');
		}).catch(function (error) {
			$log.error(error);
		});
	}
}

module.exports = {
	AuthCtrl: AuthCtrl
};