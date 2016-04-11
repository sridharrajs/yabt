'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Auth, $state, Me, $rootScope, Article, growl, usSpinnerService) {
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

	usSpinnerService.stop('spinner-1');

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

	angular.element(document).on('paste', (e) => {
		if (e.target.id === 'articleId' || e.target.id === 'Search-box') {
			return;
		}
		let state = $state.current.url;

		let urlStates = [
			'dashboard',
			'favourites',
			'archive',
			'videos',
			'add'
		];

		if (!_.includes(urlStates, state)) {
			return;
		}

		let clipBoard = e.originalEvent.clipboardData.getData('text/plain');
		$state.go('home.add').then(()=> {
			self.activeTab = 'add';
			self.newUrl = clipBoard;
			angular.element('#articleId').focus().val(clipBoard);
			e.preventDefault();
		});

	});


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