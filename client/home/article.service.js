'use strict';

angular
	.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL, $http) {
	let service = {
		addArticle: (data) => {
			return $http.post(SERVERURL + 'articles', data);
		},
		archive: (articleId)=> {
			return $http.put(SERVERURL + `articles/${articleId}`, {
				actions: {
					archive: true
				}
			});
		},
		deleteArticle: (articleId)=> {
			return $http.delete(SERVERURL + `articles/${articleId}`);
		},
		deleteAll: ()=> {
			return $http.delete(SERVERURL + 'articles/');
		},
		favourite: (item)=> {
			return $http.put(SERVERURL + `articles/${item.articleId}`, {
				actions: {
					favourite: !item.isFavourited
				}
			});
		},
		getArticles: (pageNo) => {
			let page = 0;
			if (!_.isUndefined(pageNo)) {
				page = pageNo;
			}
			return $http.get(SERVERURL + `articles?page=${page}`);
		}
	};
	return service;
}

