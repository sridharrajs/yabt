'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, Article, $state, Me, $rootScope, growl) {
	let self = this;

	self.articles = [];

	self.newUrl = '';
	self.searchKeyword = '';

	self.articlesCount = Me.articlesCount;
	self.emailId = Me.emailId;
	self.profile_url = Me.profile_url;
	self.username = Me.username;

	self.addUrl = addUrl;
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

	function addUrl() {
		if (!self.newUrl) {
			return;
		}
		self.loading = true;
		Article.addArticle({
			url: self.newUrl
		}).then((response) => {
			growl.success('Success!');
			self.newUrl = '';
			self.articlesCount = self.articlesCount + 1;
			$rootScope.$broadcast('addArticle');
			self.loading = false;
		}).catch((response) => {
			self.alertMsg = response.data.msg;
			growl.error(`Failed! - ${self.alertMsg}`);
			self.loading = false;
		});
	}

	$('#articleId').focus();

}