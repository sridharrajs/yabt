angular.module('readLater')
	.factory('Auth', Auth);

Auth.$inject = ['SERVERURL', '$http'];

function Auth(SERVERURL, $http) {

	var auth = {
		login: function(data) {
			return $http.post(SERVERURL + 'login', data);
		},
		signup: function(data) {
			return $http.post(SERVERURL + 'users', data);
		}
	};
	return auth;
}
