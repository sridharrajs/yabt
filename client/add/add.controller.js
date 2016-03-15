/**
 * Created by sridharrajs.
 */

angular
	.module('readLater')
	.controller('AddCtrl', controller);

function controller(Article, $rootScope, growl) {
	let self = this;
	self.addUrl = addUrl;
	self.newUrl = '';

	function addUrl() {
		if (!self.newUrl) {
			return;
		}
		self.loading = true;
		Article.addArticle({
			url: self.newUrl
		}).then((response) => {
			growl.success('Success!');
			self.newUrl = '';
			$rootScope.$broadcast('addArticle');
			self.loading = false;
		}).catch((response) => {
			self.alertMsg = response.data.msg;
			growl.error(`Failed! - ${self.alertMsg}`);
			self.loading = false;
		});
	}


}