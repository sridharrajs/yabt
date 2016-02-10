'use strict';

(function () {
	'use strict';

	var envirorment = {
		'local': {
			serverURL: 'http://myreader.sridhar.co:9999/api/'
		}
	};

	var selectedEnv = envirorment['local'];
	var selectedServerURL = selectedEnv.serverURL;

	angular.module('readLater', ['ngMessages', 'ui.router', 'angular-ladda', 'oitozero.ngSweetAlert']).config(configuration).constant('SERVERURL', selectedServerURL).run(initApp);

	function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
		var AUTH_FDLR = 'auth/view/';
		var HOME_FDLR = 'home/view/';

		$stateProvider.state('login', {
			url: '/',
			controller: 'AuthCtrl as authCtrl',
			templateUrl: AUTH_FDLR + 'login.html'
		}).state('home', {
			url: '/home',
			controller: 'HomeCtrl as homeCtrl',
			templateUrl: HOME_FDLR + 'home.html'
		});

		$urlRouterProvider.otherwise('/');
		$httpProvider.interceptors.push('APIInterceptor');
	}

	function isAuthenticated(Auth) {
		var authToken = Auth.getToken();
		if (authToken) {
			return true;
		}
		return false;
	}

	function initApp($rootScope, Auth, $state) {
		$rootScope.$on('$stateChangeStart', function (event, toState) {
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
})();