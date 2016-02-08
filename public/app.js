(function () {
	'use strict';

	let envirorment = {
		'local': {
			serverURL: 'http://localhost:9999/api/'
		}
	};

	let selectedEnv = envirorment['local'];
	let selectedServerURL = selectedEnv.serverURL;

	angular
		.module('readLater', [
			'ngMessages',
			'ui.router',
			'angular-ladda',
			'oitozero.ngSweetAlert'
		])
		.config(configuration)
		.constant('SERVERURL', selectedServerURL)
		.run(initApp);

	function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
		let AUTH_FDLR = 'auth/view/';
		let HOME_FDLR = 'home/view/';

		$stateProvider
			.state('login', {
				url: '/',
				controller: 'AuthCtrl as authCtrl',
				templateUrl: AUTH_FDLR + 'login.html'
			})
			.state('home', {
				url: '/home',
				controller: 'HomeCtrl as homeCtrl',
				templateUrl: HOME_FDLR + 'home.html'
			});

		$urlRouterProvider.otherwise('/');
		$httpProvider.interceptors.push('APIInterceptor');
	}

	function isAuthenticated(Auth) {
		let authToken = Auth.getToken();
		if (authToken) {
			return true;
		}
		return false;
	}

	function initApp($rootScope, Auth, $state) {
		$rootScope.$on('$stateChangeStart', (event, toState) => {
			if (toState.name !== 'login') {
				if (!isAuthenticated(Auth)) {
					event.preventDefault();
					$state.go('login');
				}
			}
			if (toState.name === 'login') {
				if (isAuthenticated(Auth)) {
					event.preventDefault();
					$state.go('home');
				}
			}
			if (toState.redirectTo) {
				event.preventDefault();
				$state.go(toState.redirectTo);
			}
		});
	}

}());
