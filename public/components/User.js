/**
 * Created by sridharrajs on 2/8/16.
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


