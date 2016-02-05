'use strict';

angular
	.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL, $http) {
	let service = {
		getArticles: () => {
			return $http.get(SERVERURL + 'articles');
		},
		addArticle: (data) => {
			return $http.post(SERVERURL + 'articles', data);
		}
	};
	return service;
}


