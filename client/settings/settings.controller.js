/**
 * Created by sridharrajs on 2/12/16.
 */

'use strict';

angular
	.module('readLater')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl(SERVERURL, $timeout, Upload) {
	let self = this;

	self.pocketFile = SERVERURL + 'articles/import-pocket';

	self.uploadFiles = function (file, errFiles) {
		console.log('setting loaded', self.pocketFile);
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
					"Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
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