/**
 * Created by sridharrajs on 2/8/16.
 */
'use strict';

angular.module('readLater').factory('User', User);

function User(SERVERURL, $http) {
	var service = {
		getMe: function getMe() {
			return $http.get(SERVERURL + 'users/me');
		}
	};
	return service;
}