/**
 * Created by sridharrajs on 2/16/16.
 */

angular
	.module('readLater')
	.controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl($timeout, $log, Article, SweetAlert, Me, init) {
	let self = this;

	self.alertMsg = '';
	self.alertClass = '';
	self.articles = [];

	self.pageNo = init.pageNo;
	self.articles = _.union(self.articles, init.articles);
	self.articlesCount = Me.articlesCount;

	self.addUrl = addUrl;
	self.deleteArticle = deleteArticle;
	self.fetchNextArticle = fetchNextArticle;
	self.previousArticle = previousArticle;
	self.archive = archive;

	function deleteArticle(id) {
		SweetAlert.swal({
			title: 'Are you sure?',
			allowOutsideClick: true,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			closeOnConfirm: true
		}, function (isConfirm) {
			if(isConfirm){
			Article
				.deleteArticle(id)
				.then((response)=> {
					$(`#${id}`).remove();
					self.alertMsg = 'Success!';
					self.alertClass = 'show alert-success';
					clearMsg();
					self.articlesCount--;
				})
				.catch((err)=> {
					self.alertMsg = 'Failed :(';
					self.alertClass = 'show alert-danger';
					clearMsg();
				});
			}
		});
	}

	function archive(id) {
		SweetAlert.swal({
			title: 'Are you sure?',
			allowOutsideClick: true,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			closeOnConfirm: true
		}, function (isConfirm) {
			if(isConfirm){
			Article
				.archive(id)
				.then((response)=> {
					$(`#${id}`).remove();
					self.alertMsg = 'Success!';
					self.alertClass = 'show alert-success';
					clearMsg();
					self.articlesCount--;
				})
				.catch((err)=> {
					self.alertMsg = 'Failed :(';
					self.alertClass = 'show alert-danger';
					clearMsg();
				});
			}
		});
	}

	function clearMsg() {
		$timeout(()=> {
			self.alertClass = '';
		}, 1000);
	}

	function fetchNextArticle() {
		self.pageNo = self.pageNo + 1;
		Article
			.getArticles(self.pageNo)
			.then((response) => {
				self.articles.length = 0;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
	}

	function previousArticle() {
		if (self.pageNo >= 1) {
			self.pageNo = self.pageNo - 1;
		}
		Article
			.getArticles(self.pageNo)
			.then((response) => {
				self.articles.length = 0;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
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
				self.articlesCount++;
			})
			.catch((err) => {
				$log.error(err);
				self.alertMsg = 'Failed :(';
				self.alertClass = 'show alert-danger';
				clearMsg();
				self.loading = false;
			});
	}

	$('#articleId').focus();

}