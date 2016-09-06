/**
 * Created by sridharrajs on 2/16/16.
 */

angular
	.module('ynbt')
	.controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl(init) {
	let self = this;

	({pageNo: self.pageNo} = init);
	self.articles = _.union([], init.articles);
}