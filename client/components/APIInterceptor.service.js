'use strict';

angular
	.module('readLater')
	.service('APIInterceptor', APIInterceptor);

function APIInterceptor($injector, SERVERURL, $log) {
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
		if (res.config.url.indexOf(SERVERURL) === 0 && res.data.token) {
			let Auth = $injector.get('Auth');
			Auth.saveToken(res.data.token);
			$log.info('AUTH TOKEN SAVED');
		}
		return res;
	}

}

APIInterceptor.$inject = ['$injector', 'SERVERURL', '$log'];
