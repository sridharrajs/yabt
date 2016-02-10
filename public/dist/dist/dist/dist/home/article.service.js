'use strict';

angular.module('readLater').factory('Article', Article);

function Article(SERVERURL, $http) {
	var service = {
		getArticles: function getArticles(pageNo) {
			return $http.get(SERVERURL + ('articles?page=' + pageNo));
		},
		addArticle: function addArticle(data) {
			return $http.post(SERVERURL + 'articles', data);
		},
		deleteArticle: function deleteArticle(articleId) {
			return $http.delete(SERVERURL + 'articles/' + articleId);
		}
	};
	return service;
}

module.exports = {
	Article: Article
};