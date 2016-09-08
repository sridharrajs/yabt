/**
 * Created by sridharrajs on 2/12/16.
 */

'use strict';

angular
	.module('ynbt')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl(SERVER_URL, $timeout, Upload, Article) {
	let self = this;

	self.pocketFile = SERVER_URL + 'import/pocket';
	self.alertMsg = '';
	self.alertClass = '';

	self.importFromTwitter = importFromTwitter;

	function importFromTwitter() {

	}

	self.clearArticles = ()=> {
		Article.deleteAll().then(()=> {
		});
	};

	function clearMsg() {
		$timeout(()=> {
			self.alertClass = '';
		}, 1000);
	}

	self.uploadFiles = function (file, errFiles) {
		console.log('setting loaded', self.pocketFile);
		self.loading = true;
		self.f = file;
		self.errFile = errFiles && errFiles[0];
		if (file) {
			file.upload = Upload.upload({
				url: self.pocketFile,
				method: 'POST',
				arrayKey: '',
				data: {
					file: file,
					filename: file.name, // this is needed for Flash polyfill IE8-9,
					"Content-Type": file.type != '' ? file.type : 'application/octet-stream' // content type of the file (NotEmpty)
				}
			});

			file.upload.then((response) => {
				self.alertMsg = 'Success!';
				self.alertClass = 'show alert-success';
				clearMsg();
				$timeout(function () {
					file.result = response.data;
				});
				self.loading = false;
			}, (response) => {
				if (response.status > 0)
					self.errorMsg = response.status + ': ' + response.data;
				self.loading = false;
				console.log('response', response.data.msg);
				self.alertMsg = 'Failed :(';
				self.alertClass = 'show alert-danger';
				clearMsg();
			}, (evt) => {
				file.progress = Math.min(100, parseInt(100.0 *
					evt.loaded / evt.total));
			});
		}
	}

}