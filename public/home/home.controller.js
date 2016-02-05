'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($log, Auth, $state, Article, Upload, $timeout) {
	let self = this;

	self.articles = [];
	self.nextPage = 0;

	self.addUrl = addUrl;
	self.deleteArticle = deleteArticle;
	self.logout = logout;
	self.fetchArticle = fetchArticle;

	function deleteArticle(id) {
		Article
			.deleteArticle(id)
			.then((response)=> {
				console.log('resoinse', response.data);
			})
			.catch((err)=> {
				alert('asdasd');
			});
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

	function addUrl(isValid) {
		if (!isValid) {
			return;
		}
		let data = {
			url: self.newUrl
		}

		Article
			.addArticle(data)
			.then((data) => {
				$log.info("Article added sucessfully");
				self.newUrl = '';
				init();
			})
			.catch((err) => {
				$log.error(err);
			});

	}

}
