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
			'ngMaterial',
			'ui.router',
			'ngMessages',
			'ngFileUpload'
		])
		.config(configuration)
		.constant('SERVERURL', selectedServerURL)
		.run(initApp);

	function configuration($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
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

		$mdIconProvider
			.defaultIconSet('./assets/svg/avatars.svg', 128)
			.icon('menu', './assets/svg/menu.svg', 24)
			.icon('share', './assets/svg/share.svg', 24)
			.icon('google_plus', './assets/svg/google_plus.svg', 512)
			.icon('hangouts', './assets/svg/hangouts.svg', 512)
			.icon('twitter', './assets/svg/twitter.svg', 512)
			.icon('phone', './assets/svg/phone.svg', 512);

		$mdThemingProvider
			.theme('default')
			.primaryPalette('brown')
			.accentPalette('red');

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
