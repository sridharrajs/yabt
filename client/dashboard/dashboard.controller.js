/**
 * Created by sridharrajs on 2/16/16.
 */

angular.module('yabt').controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl(init, $rootScope) {
  let self = this;

  ({pageNo: self.pageNo} = init);
  self.articles = _.union([], init.articles);

  $rootScope.$on('append-new-article', (event, article) => {
    self.articles.unshift(article);
  });
}
