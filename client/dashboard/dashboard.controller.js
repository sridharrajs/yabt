/**
 * Created by sridharrajs on 2/16/16.
 */

angular
	.module('readLater')
	.controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl(Article, init) {
	let self = this;

	self.articles = [];

	self.pageNo = init.pageNo;
	self.articles = _.union(self.articles, init.articles);

}