/**
 * Created by sridharrajs.
 */

angular.module('yabt')
    .controller('FavouritesCtrl', controller);

function controller(init) {

    let self = this;

    self.pageNo = init.pageNo;
    self.articles = _.union([], init.articles);

}
