/**
 * Created by sridharrajs on 2/16/16.
 */

angular
	.module('readLater')
	.controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl($timeout, $log, Article, Me, init) {
	let self = this;

	self.alertMsg = '';
	self.alertClass = '';
	self.articles = [];
	self.newUrl = '';

	self.pageNo = init.pageNo;
	self.articles = _.union(self.articles, init.articles);
	self.articlesCount = Me.articlesCount;

	self.addUrl = addUrl;
	self.fetchNextArticle = fetchNextArticle;
	self.previousArticle = previousArticle;

	function clearMsg() {
		$timeout(()=> {
			self.alertClass = '';
		}, 3000);
	}

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

	function addUrl() {
		self.loading = true;
		Article.addArticle({
			url: self.newUrl
		}).then((response) => {
			self.newUrl = '';
			self.alertMsg = 'Success!';
			self.alertClass = 'show alert-success';
			clearMsg();
			self.articles.push(response.data.data.articles);
			//self.articles.unshift(response.data.data.articles);
			self.loading = false;
			self.articlesCount++;
		}).catch((response) => {
			$log.error(response);
			self.alertMsg = response.data.msg;
			self.alertClass = 'show alert-danger';
			clearMsg();
			self.loading = false;
		});
	}

	angular.element('#articleId').focus();

	angular.element(document).on('paste', function (e) {
		self.newUrl = e.originalEvent.clipboardData.getData('text/plain');
		angular.element('#articleId')
			.focus()
			.val(e.originalEvent.clipboardData.getData('text/plain'));
		e.preventDefault();
	});
}