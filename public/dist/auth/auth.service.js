'use strict';

angular.module('readLater').factory('Auth', Auth);

Auth.$inject = ['SERVERURL', '$http', '$window'];

function Auth(SERVERURL, $http, $window) {
	var _this = this;

	var AUTH_TOKEN_KEY = 'authToken';

	var auth = {
		login: function login(data) {
			return $http.post(SERVERURL + 'users/login', data);
		},
		signup: function signup(data) {
			return $http.post(SERVERURL + 'users', data);
		},
		saveToken: function saveToken(token) {
			return $window.localStorage[AUTH_TOKEN_KEY] = token;
		},
		removeToken: function removeToken() {
			return $window.localStorage.clear();
		},
		getToken: function getToken() {
			return $window.localStorage[AUTH_TOKEN_KEY];
		},
		parseJwt: function parseJwt(token) {
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			return JSON.parse($window.atob(base64));
		},
		isAuthed: function isAuthed() {
			var token = _this.getToken();
			if (token) {
				var params = _this.parseJwt(token);
				return Math.round(new Date().getTime() / 1000) <= params.exp;
			} else {
				return false;
			}
		}
	};
	return auth;
}