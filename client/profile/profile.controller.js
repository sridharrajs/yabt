/**
 * Created by sridharrajs on 2/16/16.
 */

angular
    .module('yabt')
    .controller('ProfileCtrl', ProfileCtrl);

function ProfileCtrl(userInfo, User, $timeout, $rootScope) {

    let self = this;

    self.alertMsg = '';
    self.alertClass = '';
    self.newPassword = '';

    self.username = userInfo.me.user_name;

    self.reset = reset;
    self.update = update;

    function reset() {
        self.username = userInfo.me.user_name;
        self.newPassword = '';
    }

    function update() {
        self.loading = true;
        let user = {
            username: self.user_name,
            newPassword: self.newPassword
        };

        User.update(user).then((response)=> {
            self.loading = false;
            self.alertMsg = 'Success!';
            self.alertClass = 'show alert-success';
            clearMsg();
            let reloadReq = response.data.data.reloadReq;
            $timeout(()=> {
                if (reloadReq) {
                    $rootScope.$broadcast('logout');
                }
                $rootScope.$broadcast('fetch-user', {
                    username: self.username
                });
            }, 2000);
        }).catch((response)=> {
            self.loading = false;
            console.log('response', response.data.msg);
            self.alertMsg = 'Failed :(';
            self.alertClass = 'show alert-danger';
            clearMsg();
        });
    }

    function clearMsg() {
        $timeout(()=> {
            self.alertClass = '';
        }, 1000);
    }

}
