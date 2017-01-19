/**
 * Created by sridharrajs on 2/12/16.
 */

'use strict';

angular
  .module('yabt')
  .controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl(Article) {
  let self = this;

  self.clearArticles = ()=> {
    Article.deleteAll();
  };

}
