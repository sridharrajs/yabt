'use strict';

angular.module('readLater').controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ["Auth", "$log", "$state"];

function AuthCtrl(Auth, $log, $state) {
	var self = this;

	self.alertMsg = '';
	self.alertClass = '';
	self.user = {
		emailId: '',
		password: ''
	};

	self.login = login;
	self.register = register;

	function login(isValid) {
		if (!isValid) {
			return;
		}
		self.loading = true;
		Auth.login(self.user).then(function (data) {
			self.alertMsg = 'Logging in!';
			self.alertClass = 'show alert-success';
			$state.go('home');
			self.loading = false;
		}).catch(function (error) {
			self.alertMsg = error;
			self.alertClass = 'show alert-danger';
			$log.error(error);
			self.loading = false;
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