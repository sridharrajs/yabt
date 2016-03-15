'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, $state, Me, $rootScope) {
	let self = this;

	self.articles = [];

	self.activeTab = $state.current.url;
	self.newUrl = '';
	self.searchKeyword = '';

	self.articlesCount = Me.articlesCount;
	self.emailId = Me.emailId;
	self.profile_url = Me.profile_url;
	self.username = Me.username;

	self.logout = logout;

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	$rootScope.$on('fetch-user', (event, body)=> {
		self.username = body.username;
	});

	$rootScope.$on('logout', (event)=> {
		logout();
	});

	$rootScope.$on('addArticle', ()=> {
		self.articlesCount++;
	});

	$rootScope.$on('lessArticle', ()=> {
		self.articlesCount--;
	});

	$('#articleId').focus();

	self.isActiveTab = function (activeTab) {
		return activeTab === self.activeTab;
	};

	self.selectTab = function (tab) {
		self.activeTab = tab;
	};


	angular.element('#articleId').focus();
	angular.element(document).on('paste', (e) => {
		$state.go('home.add');
		let clipBoard = e.originalEvent.clipboardData.getData('text/plain');
		console.log('ccc', clipBoard);
		self.newUrl = clipBoard;
		angular.element('#articleId').focus().val(clipBoard);
		e.preventDefault();
	});

}