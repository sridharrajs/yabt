	'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($timeout, $log, Auth, $state, Article, SweetAlert) {
	let self = this;

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
			Article
				.deleteArticle(id)
				.then((response)=> {
					$(`#${id}`).remove();
					self.alertMsg = 'Success!';
					self.alertClass = 'show alert-success';
					clearMsg();
				})
				.catch((err)=> {
					self.alertMsg = 'Failed :(';
					self.alertClass = 'show alert-danger';
					clearMsg();
				});
		});
	}

	function clearMsg() {
		$timeout(()=> {
			self.alertClass = '';
		}, 1000);
	}

	init();

	function init() {
		Article
			.getArticles(self.nextPage)
			.then((response) => {
				self.nextPage = response.data.data.nextPage;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
	}

	function fetchArticle() {
		Article
			.getArticles(self.nextPage)
			.then((response) => {
				self.articles.length = 0;
				self.nextPage = response.data.data.nextPage;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
	}

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	function addUrl() {
		self.loading = true;
		let data = {
			url: self.newUrl
		};
		Article
			.addArticle(data)
			.then((response) => {
				self.newUrl = '';
				self.alertMsg = 'Success!';
				self.alertClass = 'show alert-success';
				clearMsg();
				self.articles.unshift(response.data.data.articles);
				self.loading = false;
			})
			.catch((err) => {
				$log.error(err);
				self.alertMsg = 'Failed :(';
				self.alertClass = 'show alert-danger';
				clearMsg();
				self.loading = false;
			});
	}

}
