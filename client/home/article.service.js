'use strict';

angular
	.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL, $http) {
	let service = {
		getArticles: (pageNo) => {
			let page = 0;
			if (!_.isUndefined(pageNo)) {
				page = pageNo;
			}
			return $http.get(SERVERURL + `articles?page=${page}`);
		},
		addArticle: (data) => {
			return $http.post(SERVERURL + 'articles', data);
		},
		deleteArticle: (articleId)=> {
			return $http.delete(SERVERURL + 'articles/' + articleId);
		},
		deleteAll: ()=> {
			return $http.delete(SERVERURL + 'articles/');
		}
	};
	return service;
}

