'use strict';

angular
    .module('yabt')
    .factory('Auth', Auth);

Auth.$inject = [
    'SERVER_URL',
    '$http',
    '$window'
];

function Auth(SERVER_URL, $http, $window) {
    let AUTH_TOKEN_KEY = 'authToken';

    return {
        login: (data) => {
            return $http({
                method: 'POST',
                url: `${SERVER_URL}users/login`,
                data: data
            });
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
        }
    };
}
