'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, $state, Me, $rootScope) {
	let self = this;

	self.emailId = Me.emailId;
	self.profile_url = Me.profile_url;
	self.username = Me.username;

	self.logout = logout;

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	$rootScope.$on('fetch-user', (event, body)=> {
		self.username = body.username;
	});

	$rootScope.$on('logout', (event)=> {
		logout();
	});

}