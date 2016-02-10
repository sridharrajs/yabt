'use strict';

angular.module('readLater').service('APIInterceptor', APIInterceptor);

function APIInterceptor($injector, SERVERURL, $log) {
	var service = this;

	service.request = function (config) {
		var Auth = $injector.get('Auth');
		var access_token = Auth.getToken();
		if (access_token) {
			config.headers.authorization = access_token;
		}
		return config;
	};

	service.response = function (res) {
		if (res.config.url.indexOf(SERVERURL) === 0 && res.data.token) {
			var Auth = $injector.get('Auth');
			Auth.saveToken(res.data.token);
			$log.info("AUTH TOKEN SAVED");
		}
		return res;
	};
}
APIInterceptor.$inject = ['$injector', 'SERVERURL', '$log'];