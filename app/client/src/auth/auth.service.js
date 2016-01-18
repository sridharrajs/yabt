angular.module('readLater')
    .factory('Auth', Auth);

Auth.$inject = ['SERVERURL', '$http', '$window'];

function Auth(SERVERURL, $http, $window) {
    var AUTH_TOKEN_KEY = 'token';

    var auth = {
        login: function(data) {
            return $http.post(SERVERURL + 'login', data);
        },
        signup: function(data) {
            return $http.post(SERVERURL + 'users', data);
        },
		saveToken: function(token) {
			return $window.localStorage['authToken'] = token;

		},
		removeToken:function(){
			 return $window.localStorage.clear();
		},
		getToken: function() {
			return $window.localStorage['authToken'];
		},
		parseJwt: function(token) {
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			return JSON.parse($window.atob(base64));
		},
		isAuthed: function() {
			var token = this.getToken();
			if (token) {
				var params = this.parseJwt(token);
				return Math.round(new Date().getTime() / 1000) <= params.exp;
			} else {
				return false;
			}
		}
    };
    return auth;
}
