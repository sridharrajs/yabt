/**
 * Created by sridharrajs on 2/16/16.
 */

angular
	.module('readLater')
	.controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl(Article, Me, init) {
	let self = this;

	self.articles = [];

	self.pageNo = init.pageNo;
	self.articles = _.union(self.articles, init.articles);

	self.fetchNextArticle = fetchNextArticle;
	self.previousArticle = previousArticle;

	function fetchNextArticle() {
		self.pageNo = self.pageNo + 1;
		Article.getArticles({pageNo: self.pageNo}).then((response) => {
			self.articles.length = 0;
			//$('.article-group').empty()
			self.articles = _.union(self.articles, response.data.data.articles)
//			self.articles = response.data.data.articles;
		});
	}

	function previousArticle() {
		if (self.pageNo >= 1) {
			self.pageNo = self.pageNo - 1;
		}
		Article.getArticles({
			pageNo: self.pageNo
		}).then((response) => {
			self.articles.length = 0;
			//$('.article-group').empty()
			self.articles = _.union(self.articles, response.data.data.articles)
		});
	}

	angular.element('#articleId').focus();
	angular.element(document).on('paste', function (e) {
		self.newUrl = e.originalEvent.clipboardData.getData('text/plain');
		angular.element('#articleId').focus().val(e.originalEvent.clipboardData.getData('text/plain'));
		e.preventDefault();
	});
}