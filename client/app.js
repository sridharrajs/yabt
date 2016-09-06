(function () {
	'use strict';

	let envirorment = {
		'local': {
			serverURL: 'http://localhost:9999/api/'
		}
	};

	let selectedEnv = envirorment['local'];
	let selectedServerURL = selectedEnv.serverURL;

	angular.module('ynbt', [
			'ngFileUpload',
			'ngMessages',
			'ui.router',
			'angular-ladda',
			'oitozero.ngSweetAlert',
			'angular-growl',
			'angularSpinner'
		], (growlProvider) => {
			growlProvider.globalTimeToLive({
				success: 3000,
				error: 3000,
				warning: 3000,
				info: 3000
			});
		})
		.config(configuration)
		.constant({
			SERVER_URL: selectedServerURL
		})
		.run(initApp);

	function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
		let AUTH_FDLR = 'auth/view/';
		let HOME_FDLR = 'home/view/';
		let ADD_FDLR = 'add/view/';
		let BUNDLE_FDLR = 'bundle/view/';
		let SETTINGS_FDLR = 'settings/view/';
		let DASHBOARD_FDLR = 'dashboard/view/';
		let PROFILE_FDLR = 'profile/view/';

		$stateProvider.state('login', {
			url: '/',
			controller: 'AuthCtrl as authCtrl',
			templateUrl: AUTH_FDLR + 'login.html'
		}).state('home', {
			url: '/',
			controller: 'HomeCtrl as homeCtrl',
			redirectTo: 'home.unreads',
			templateUrl: HOME_FDLR + 'home.html',
			resolve: {
				userInfo: getMyDetails
			}
		}).state('home.unreads', {
			url: 'unreads',
			controller: 'DashboardCtrl as dashboardCtrl',
			templateUrl: DASHBOARD_FDLR + 'dashboard.html',
			resolve: {
				init: init
			}
		}).state('home.profile', {
			url: 'profile',
			controller: 'ProfileCtrl as profileCtrl',
			templateUrl: PROFILE_FDLR + 'profile.html',
			resolve: {
				userInfo: getMyDetails,
				User: User
			}
		}).state('home.settings', {
			url: 'settings',
			controller: 'SettingsCtrl as settingsCtrl',
			templateUrl: SETTINGS_FDLR + 'settings.html'
		}).state('home.favourites', {
			url: 'favourites',
			controller: 'DashboardCtrl as dashboardCtrl',
			templateUrl: DASHBOARD_FDLR + 'dashboard.html',
			resolve: {
				init: getFavourites
			}
		}).state('home.add', {
			url: 'add',
			templateUrl: ADD_FDLR + 'add.html'
		}).state('home.archive', {
			url: 'archive',
			controller: 'DashboardCtrl as dashboardCtrl',
			templateUrl: DASHBOARD_FDLR + 'dashboard.html',
			resolve: {
				Me: getMyDetails,
				init: getArchive
			}
		}).state('home.videos', {
			url: 'videos',
			controller: 'DashboardCtrl as dashboardCtrl',
			templateUrl: DASHBOARD_FDLR + 'dashboard.html',
			resolve: {
				Me: getMyDetails,
				init: getVideos
			}
		}).state('home.bundle', {
			url: 'bundle',
			templateUrl: BUNDLE_FDLR + 'bundle.html'
		});

		$urlRouterProvider.otherwise('/');
		$httpProvider.interceptors.push('APIInterceptor');
	}

	function getMyDetails(User, Auth) {
		return User.getMe().then((response)=> {
			console.log(response.data.data);
			return response.data.data;
		}).catch(()=> {
			Auth.removeToken();
		});
	}

	function init(Article) {
		return Article.getArticles().then((response) => {
			let initData = {};
			initData.pageNo = response.data.data.pageNo;
			initData.articles = response.data.data.articles;
			console.log('initData', initData);
			return initData;
		}).catch((err)=> {
			console.log('error', err.stack);
		});
	}

	function getArchive(Article) {
		return Article.getArticles({
			fetchArchive: true
		}).then((response) => {
			let initData = {};
			initData.pageNo = response.data.data.pageNo;
			initData.articles = response.data.data.articles;
			return initData;
		});
	}

	function getVideos(Article) {
		return Article.getArticles({
			type: 'video'
		}).then((response) => {
			let initData = {};
			({
				pageNo: initData.pageNo,
				articles: initData.articles
			} = response.data.data);
			return initData;
		});
	}

	function getFavourites(Article) {
		return Article.getArticles({
			fetchFavourites: true
		}).then((response) => {
			let initData = {};
			({
				pageNo: initData.pageNo,
				articles: initData.articles
			} = response.data.data);
			return initData;
		});
	}


	function isAuthenticated(Auth) {
		return Auth.getToken();
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
					$state.go('home.unreads');
				}
			}

			if (toState.redirectTo) {
				event.preventDefault();
				$state.go(toState.redirectTo);
			}
		});

		$rootScope.$on('$stateChangeStart', () => {
			$rootScope.stateIsLoading = false;
		});

	}

}());
