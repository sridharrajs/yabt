angular
    .module('users')
    .controller('HomeCtrl',HomeCtrl); 
        

function HomeCtrl($log,Auth,$state,Article) {
    var self = this;
    self.logout = logout;
    self.addUrl = addUrl;

    init();

    function init(){
    	Article.getArticles().then(function(data){
    		$log.debug(data);
    	});
    }

    function logout(){
    	Auth.removeToken();
    	$state.go('login');
    }

    function addUrl(isValid){
    	if(!isValid){
    		return;
    	}
    	var data = {
    		url:self.newUrl
    	}

    	Article.addArticle(data).then(function(data){
    		$log.info("Article added sucessfully");
    		self.newUrl = '';
    	}).catch(function(err){
    		$log.error(err);
    	});
    }


}
