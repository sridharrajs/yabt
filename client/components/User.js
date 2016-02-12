/**
 * Created by sridharrajs.
 */

'use strict';

angular
	.module('readLater')
	.factory('User', User);

function User(SERVERURL, $http) {
	let service = {
		getMe: () => {
			return $http.get(SERVERURL + 'users/me');
		}
	};
	return service;
}
