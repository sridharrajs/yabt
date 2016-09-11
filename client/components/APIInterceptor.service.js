'use strict';

angular
	.module('yabt')
	.service('APIInterceptor', APIInterceptor);

APIInterceptor.$inject = ['$injector', 'SERVER_URL', '$log'];

function APIInterceptor($injector, SERVER_URL, $log) {
	let service = this;

	service.request = (config) => {
		let Auth = $injector.get('Auth');
		let access_token = Auth.getToken();
		if (access_token) {
			config.headers.authorization = access_token;
		}
		return config;
	};

	service.response = (res) => {
		if (res.config.url.indexOf(SERVER_URL) === 0 && res.data.token) {
			let Auth = $injector.get('Auth');
			Auth.saveToken(res.data.token);
			$log.info('AUTH TOKEN SAVED');
		}
		return res;
	}

}
