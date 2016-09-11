/**
 * Created by sridharrajs.
 */

'use strict';

angular
	.module('yabt')
	.factory('User', User);

function User(SERVER_URL, $http) {
	return {
		getMe: () => {
			return $http({
				method: 'GET',
				url: `${SERVER_URL}users/me`
			});
		},
		update: (newValues)=> {
			return $http({
				method: 'PUT',
				url: `${SERVER_URL}users/me`,
				data: newValues
			});
		}
	};
}
