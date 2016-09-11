'use strict';

angular
	.module('yabt')
	.factory('Article', Article);

function Article(SERVER_URL, $http) {

	const DEFAULT_QUERY = {
		pageNo: 0,
		fetchFavourites: false,
		fetchArchive: false,
		type: 'all'
	};

	return {
		addArticle: (data) => {
			return $http({
				method: 'POST',
				url: `${SERVER_URL}articles`,
				data: data
			});
		},
		archive: (articleId)=> {
			return $http({
				method: 'PUT',
				url: `${SERVER_URL}articles/${articleId}`,
				data: {
					actions: {
						archive: true
					}
				}
			});
		},
		deleteArticle: (articleId)=> {
			return $http({
				method: 'DELETE',
				url: `${SERVER_URL}articles/${articleId}`
			});
		},
		deleteAll: ()=> {
			return $http({
				method: 'DELETE',
				url: `${SERVER_URL}articles/`
			});
		},
		favourite: (item)=> {
			return $http({
				method: 'PUT',
				url: `${SERVER_URL}articles/${item.articleId}`,
				data: {
					actions: {
						favourite: item.isFavourited
					}
				}
			});
		},
		getArticles: (query) => {
			let paddingQuery = _.defaults(query, DEFAULT_QUERY);
			return $http({
				method: 'GET',
				url: `${SERVER_URL}articles`,
				params: paddingQuery
			});
		}
	};

}

