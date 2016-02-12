/**
 * Created by sridharrajs on 2/12/16.
 */

'use strict';

angular
	.module('readLater')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl(SERVERURL, $timeout) {
	let self = this;

	self.pocketFile = SERVERURL + 'articles/import-pocket';
	console.log('setting loaded', self.pocketFile);

	//self.uploadFiles = function (file, errFiles) {
	//	self.f = file;
	//	self.errFile = errFiles && errFiles[0];
	//	if (file) {
	//		file.upload = Upload.upload({
	//			url: self.pocketFile,
	//			data: {file: file}
	//		});
	//
	//		file.upload.then(function (response) {
	//			$timeout(function () {
	//				file.result = response.data;
	//			});
	//		}, function (response) {
	//			if (response.status > 0)
	//				self.errorMsg = response.status + ': ' + response.data;
	//		}, function (evt) {
	//			file.progress = Math.min(100, parseInt(100.0 *
	//				evt.loaded / evt.total));
	//		});
	//	}
	//}

}