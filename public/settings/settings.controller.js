/**
 * Created by sridharrajs on 2/12/16.
 */

'use strict';

angular
	.module('readLater')
	.controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl() {
	console.log('setting loaded');
	console.log('shouldnt restart');
}