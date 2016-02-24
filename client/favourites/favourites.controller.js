/**
 * Created by sridharrajs.
 */

angular
	.module('readLater')
	.controller('FavouritesCtrl', controller);

function controller(init) {

	let self = this;

	self.pageNo = init.pageNo;
	self.articles = _.union(self.articles, init.articles);


}