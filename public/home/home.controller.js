'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($log, Auth, $state, Article, Upload, $timeout) {
	let self = this;
	self.logout = logout;
	self.addUrl = addUrl;
	self.uploadFiles = uploadFiles;

	init();

	function init() {
		Article
			.getArticles()
			.then((data) => {
				$log.debug(data);
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

	function uploadFiles(file, errFiles) {
		self.f = file;
		self.errFile = errFiles && errFiles[0];
		if (file) {
			file.upload = Upload.upload({
				url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
				data: {
					file: file
				}
			});

			file
				.upload
				.then((response) => {
						$timeout(function () {
							file.result = response.data;
						});
					},
					(response) => {
						if (response.status > 0)
							self.errorMsg = response.status + ': ' + response.data;
					},
					(evt) => {
						file.progress = Math.min(100, parseInt(100.0 *
							evt.loaded / evt.total));
					});
		}
	}

}
