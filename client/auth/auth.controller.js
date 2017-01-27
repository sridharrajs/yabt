'use strict';

angular.module('yabt').controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['Auth', '$log', '$state'];

function AuthCtrl(Auth, $log, $state) {
  let self = this;

  self.alertMsg = '';
  self.alertClass = '';
  self.user = {
    email: '',
    password: ''
  };

  self.login = login;
  self.register = register;

  function login(isValid) {
    if (!isValid) {
      return;
    }
    self.loading = true;
    Auth.login(self.user).then(() => {
      self.alertMsg = 'Logging in!';
      self.alertClass = 'show alert-success';
      $state.go('home');
    }).catch((response) => {
      self.alertMsg = response.data.msg;
      self.alertClass = 'show alert-danger';
    }).finally(() => {
      self.loading = false;
    });
  }

  function register(isValid) {
    if (!isValid) {
      return;
    }
    Auth.signup(self.user).then(() => {
      $log.info('registeration Successful');
      $state.go('home');
    }).catch((error) => {
      $log.error(error);
    });
  }

  $('#email').focus();

}
