'use strict';

angular.module('readLater').controller('HomeCtrl', HomeCtrl);

function HomeCtrl($timeout, $log, Auth, $state, Article, SweetAlert, User) {
	var self = this;

	self.alertMsg = '';
	self.alertClass = '';
	self.articles = [];
	self.nextPage = 0;

	self.addUrl = addUrl;
	self.deleteArticle = deleteArticle;
	self.fetchArticle = fetchArticle;
	self.logout = logout;

	function deleteArticle(id) {
		SweetAlert.swal({
			title: "Are you sure?",
			allowOutsideClick: true,
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			closeOnConfirm: true
		}, function () {
			Article.deleteArticle(id).then(function (response) {
				$('#' + id).remove();
				self.alertMsg = 'Success!';
				self.alertClass = 'show alert-success';
				clearMsg();
			}).catch(function (err) {
				self.alertMsg = 'Failed :(';
				self.alertClass = 'show alert-danger';
				clearMsg();
			});
		});
	}

	function clearMsg() {
		$timeout(function () {
			self.alertClass = '';
		}, 1000);
	}

	self.profile_url = '';
	self.emailId = '';
	init();

	User.getMe().then(function (response) {
		self.profile_url = response.data.data.profile_url;
		self.username = response.data.data.username;
		self.count = response.data.data.count;
		console.log('all good');
	}).catch(function () {
		console.log('something');
	});

	function init() {
		Article.getArticles(self.nextPage).then(function (response) {
			self.nextPage = response.data.data.nextPage;
			self.articles = _.union(self.articles, response.data.data.articles);
		});
	}

	function fetchArticle() {
		Article.getArticles(self.nextPage).then(function (response) {
			self.articles.length = 0;
			self.nextPage = response.data.data.nextPage;
			self.articles = _.union(self.articles, response.data.data.articles);
		});
	}

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	function addUrl() {
		self.loading = true;
		var data = {
			url: self.newUrl
		};
		Article.addArticle(data).then(function (response) {
			self.newUrl = '';
			self.alertMsg = 'Success!';
			self.alertClass = 'show alert-success';
			clearMsg();
			self.articles.unshift(response.data.data.articles);
			self.loading = false;
		}).catch(function (err) {
			$log.error(err);
			self.alertMsg = 'Failed :(';
			self.alertClass = 'show alert-danger';
			clearMsg();
			self.loading = false;
		});
	}
}