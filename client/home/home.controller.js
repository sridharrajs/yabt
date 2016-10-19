'use strict';

angular.module('yabt').controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, $state, userInfo, $rootScope, Article, growl) {
	let self = this;

	self.articles = [];

	self.activeTab = $state.current.url;
	self.searchKeyword = '';
	self.isUnreadTab = false;

	self.articlesCount = userInfo.articlesCount;
	self.emailId = userInfo.me.email;
	self.profile_url = userInfo.me.profile_url;
	self.username = userInfo.me.user_name;

	self.addUrl = addUrl;
	self.logout = logout;
	self.resetForm = resetForm;

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	$rootScope.$on('fetch-user', (event, body)=> {
		self.username = body.username;
	});

	$rootScope.$on('logout', ()=> {
		logout();
	});

	$rootScope.$on('addArticle', ()=> {
		self.articlesCount++;
	});

	$rootScope.$on('lessArticle', ()=> {
		if (self.activeTab === 'archive') {
			return;
		}
		if (self.articlesCount > 0) {
			self.articlesCount--;
		}
	});

	function lazySetFocus() {
		_.delay(() => {
			$('#articleId').focus();
		}, 100);
	}

	self.isActiveTab = (activeTab) => {
		return activeTab === self.activeTab;
	};

	self.selectTab = (tab) => {
		self.activeTab = tab;
		self.isUnreadTab = tab === 'unreads';
		lazySetFocus();
	};

	function resetForm() {
		self.newUrl = '';
		self.notes = '';
	}

	function addUrl() {
		if (!self.newUrl) {
			return;
		}
		self.loading = true;
		Article.addArticle({
			url: self.newUrl,
			notes: self.notes
		}).then((response) => {
			growl.success(response.data.msg);
			resetForm();
			self.loading = false;
			console.log('response', response.data);
			if (response.data.isNew) {
				$rootScope.$broadcast('addArticle');
				$rootScope.$broadcast('append-new-article', response.data.article);
			}
		}).catch((response) => {
			self.alertMsg = response.data.msg;
			growl.error(`Failed! - ${self.alertMsg}`);
			self.loading = false;
		});
	}

}
