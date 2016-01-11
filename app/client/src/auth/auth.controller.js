angular.module('readLater')
    .controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ["Auth", "$log"];

function AuthCtrl(Auth, $log) {
    var self = this;

    self.login = login;
    self.register = register;

    self.user = {
        email: '',
        password: ''
    };

    function login(isValid) {
        if (!isValid) {
            return;
        }
        Auth.login(self.user).then(function(data) {
            $log.info("Auth Successful");
        }).catch(function(error) {
            $log.error(error);
        });
    }

    function register(isValid) {
        if (!isValid) {
            return;
        }
        Auth.signup(self.user).then(function(data) {
            $log.info("registeration Successful");
        }).catch(function(error) {
            $log.error(error);
        });
    }

}
