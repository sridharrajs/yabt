'use strict';

angular
	.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL, $http) {

	const DEFAULT_QUERY = {
		pageNo: 0,
		fetchFavourites: false
	};

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
					favourite: item.isFavourited
				}
			});
		},
		getArticles: (query) => {
			let paddingQuery = _.defaults(query, DEFAULT_QUERY);
			return $http.get(SERVERURL + `articles?page=${paddingQuery.pageNo}&favourites=${paddingQuery.fetchFavourites}`);
		}
	};
	return service;
}

