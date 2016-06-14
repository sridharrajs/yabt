'use strict';

angular
	.module('myReader')
	.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['Auth', '$log', '$state'];

function AuthCtrl(Auth, $log, $state) {
	let self = this;

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
		Auth.login(self.user).then((data) => {
			self.alertMsg = 'Logging in!';
			self.alertClass = 'show alert-success';
			$state.go('home');
			self.loading = false;
		}).catch((response) => {
			self.alertMsg = response.data.msg;
			self.alertClass = 'show alert-danger';
			self.loading = false;
		});
	}

	function register(isValid) {
		if (!isValid) {
			return;
		}
		Auth.signup(self.user).then((data) => {
			$log.info('registeration Successful');
			$state.go('home');
		}).catch((error) => {
			$log.error(error);
		});
	}

	$('#emailId').focus();

}