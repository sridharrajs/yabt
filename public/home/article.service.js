'use strict';

angular
	.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL, $http) {
	let service = {
		getArticles: (pageNo) => {
			return $http.get(SERVERURL + `articles?page=${pageNo}`);
		},
		addArticle: (data) => {
			return $http.post(SERVERURL + 'articles', data);
		},
		deleteArticle: (articleId)=> {
			return $http.delete(SERVERURL + 'articles/' + articleId);
		}
	};
	return service;
}

