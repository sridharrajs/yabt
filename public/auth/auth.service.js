'use strict';

angular
	.module('readLater')
	.factory('Auth', Auth);

Auth.$inject = ['SERVERURL', '$http', '$window'];

function Auth(SERVERURL, $http, $window) {
	let AUTH_TOKEN_KEY = 'authToken';

	let auth = {
		login: (data) => {
			return $http.post(SERVERURL + 'users/login', data);
		},
		signup: (data) => {
			return $http.post(SERVERURL + 'users', data);
		},
		saveToken: (token) => {
			return $window.localStorage[AUTH_TOKEN_KEY] = token;

		},
		removeToken: () => {
			return $window.localStorage.clear();
		},
		getToken: () => {
			return $window.localStorage[AUTH_TOKEN_KEY];
		},
		parseJwt: (token) => {
			let base64Url = token.split('.')[1];
			let base64 = base64Url.replace('-', '+').replace('_', '/');
			return JSON.parse($window.atob(base64));
		},
		isAuthed: () => {
			let token = this.getToken();
			if (token) {
				let params = this.parseJwt(token);
				return Math.round(new Date().getTime() / 1000) <= params.exp;
			} else {
				return false;
			}
		}
	};
	return auth;
}
