angular.module('readLater')
	.factory('Article', Article);

function Article(SERVERURL,$http) {
	var service = {
		getArticles: function() {
			return $http.post(SERVERURL + 'article');
		}, 
		addArticle:function(data){
			return $http.post(SERVERURL + 'article', data);
		}
	};
	return service;
}


