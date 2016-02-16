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
			'ngFileUpload',
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
		let SETTINGS_FDLR = 'settings/view/';
		let DASHBOARD_FDLR = 'dashboard/view/';
		let PROFILE_FDLR = 'profile/view/';

		$stateProvider
			.state('login', {
				url: '/',
				controller: 'AuthCtrl as authCtrl',
				templateUrl: AUTH_FDLR + 'login.html'
			})
			.state('home', {
				url: '/home',
				controller: 'HomeCtrl as homeCtrl',
				redirectTo: 'home.dashboard',
				templateUrl: HOME_FDLR + 'home.html'
			})
			.state('home.dashboard', {
				url: '/dashboard',
				controller: 'DashboardCtrl as dashboardCtrl',
				templateUrl: DASHBOARD_FDLR + 'dashboard.html'
			})
			.state('home.profile', {
				url: '/profile',
				controller: 'ProfileCtrl as profileCtrl',
				templateUrl: PROFILE_FDLR + 'profile.html'
			})
			.state('home.settings', {
				url: '/settings',
				controller: 'SettingsCtrl as settingsCtrl',
				templateUrl: SETTINGS_FDLR + 'settings.html'
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
					$state.go('home.dashboard');
				}
			}
			if (toState.redirectTo) {
				event.preventDefault();
				$state.go(toState.redirectTo);
			}
		});
	}

}());
