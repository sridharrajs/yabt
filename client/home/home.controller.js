'use strict';

angular.module('ynbt').controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, $state, Me, $rootScope, Article, growl) {
	console.log(6)
	let self = this;

	self.articles = [];

	self.activeTab = $state.current.url;
	self.searchKeyword = '';
	self.isUnreadTab = false;

	self.articlesCount = Me.articlesCount;
	self.emailId = Me.emailId;
	self.profile_url = Me.profile_url;
	self.username = Me.username;

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

	$rootScope.$on('logout', (event)=> {
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
			if (response.data.data.countIncremented) {
				$rootScope.$broadcast('addArticle');
			}
		}).catch((response) => {
			self.alertMsg = response.data.msg;
			growl.error(`Failed! - ${self.alertMsg}`);
			self.loading = false;
		});
	}

}