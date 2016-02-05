'use strict';

angular
	.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL, $http) {
	let service = {
		getArticles: () => {
			return $http.get(SERVERURL + 'article');
		},
		addArticle: (data) => {
			return $http.post(SERVERURL + 'article', data);
		}
	};
	return service;
}


