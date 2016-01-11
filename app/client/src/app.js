(function() {
    'use strict';

    angular
        .module('readLater', ['ngMaterial', 'ui.router', 'users'])

    .config(configuration);


    function configuration($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
        var SRC_FDLR = 'src/';
        var AUTH_FDLR = 'auth/';
        var VIEW_FLDR = 'view/';

        $stateProvider
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: SRC_FDLR + AUTH_FDLR + VIEW_FLDR + '/register.html'
            })

        .state('login', {
            url: '/',
            controller: 'AuthCtrl as authCtrl',
            templateUrl: SRC_FDLR + AUTH_FDLR + VIEW_FLDR + '/login.html'
        });


        $urlRouterProvider.otherwise('/');

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("google_plus", "./assets/svg/google_plus.svg", 512)
            .icon("hangouts", "./assets/svg/hangouts.svg", 512)
            .icon("twitter", "./assets/svg/twitter.svg", 512)
            .icon("phone", "./assets/svg/phone.svg", 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('brown')
            .accentPalette('red');

    }
}());
