angular.module('readLater')
    .factory('Auth', Auth);

Auth.$inject = ['SERVERURL', '$http', '$cookies'];

function Auth(SERVERURL, $http, $cookies) {
    var AUTH_TOKEN_KEY = 'token';

    var auth = {
        login: function(data) {
            return $http.post(SERVERURL + 'login', data);
        },
        signup: function(data) {
            return $http.post(SERVERURL + 'users', data);
        },
        setAuth: function(authToken) {
            var now = new Date();
            var expiryDate = new Date();
            expiryDate.setDate(now.getDate() + 14); //14days
            return $cookies.put(AUTH_TOKEN_KEY, authToken, {
                expires: expiryDate
            });
        },
        getAuth: function() {
        	return $cookies.get(AUTH_TOKEN_KEY);
        }
    };
    return auth;
}
