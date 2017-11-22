'use strict';

/**
 * @ngdoc overview
 * @name Main
 * @description
 * # Main
 *
 * Main module of the application.
 */
angular.module('Main', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngActivityIndicator',
    'LocalStorageModule',
    'angularUtils.directives.dirPagination',
    'angularFileUpload',
    'ngMaterial'
], function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}).config(function($routeProvider, appConfig, $httpProvider, localStorageServiceProvider, $mdAriaProvider, $mdThemingProvider, $activityIndicatorProvider, $qProvider) {

    $mdAriaProvider.disableWarnings();

    $mdThemingProvider.theme('default')
        .primaryPalette('grey')
        .accentPalette('grey');

    localStorageServiceProvider.setPrefix(appConfig.APP_NAME);

    $qProvider.errorOnUnhandledRejections(false);

    ///start:generated:routes<<<
    $routeProvider
        .when('/', {
            templateUrl: 'routes/Main/main-route.html',
            controller: 'MainController',
            controllerAs: 'route_Main'
        })
        .when('/login', {
            templateUrl: 'routes/Login/login-route.html',
            controller: 'LoginController',
            controllerAs: 'route_Login'
        })
        .when('/about', {
            templateUrl: 'routes/About/about-route.html',
            controller: 'AboutController',
            controllerAs: 'route_About'
        })
        .when('/profile', {
            templateUrl: 'routes/Profile/profile-route.html',
            controller: 'ProfileController',
            controllerAs: 'route_Profile'
        })
        .when('/users', {
            templateUrl: 'routes/Users/users-route.html',
            controller: 'UsersController',
            controllerAs: 'route_Users'
        })
        .when('/pr', {
            templateUrl: 'routes/Pr/pr-route.html',
            controller: 'PrController',
            controllerAs: 'route_Pr'
        })
        .when('/pr-list', {
            templateUrl: 'routes/PrList/pr-list-route.html',
            controller: 'PrListController',
            controllerAs: 'route_PrList'
        })
        .otherwise({redirectTo:'/'});
    ///end:generated:routes<<<

    $activityIndicatorProvider.setActivityIndicatorStyle('CircledWhite');
    alertify.set('notifier', 'position', 'top-left');
    alertify.set('notifier', 'delay', 2);

    $httpProvider.interceptors.push('authInterceptorService');

}).run(function(authService, $rootScope, $location) {

    authService.fillAuthData();

    // register listener to watch route changes
    $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
        alertify.closeAll();
        $('.modal').modal('hide');
        $('.modal-backdrop.fade.in').remove();


        var authentication = authService.authentication;
        if (!authentication || !authentication.isAuth) {
            if (next.templateUrl != 'components/login/login.html') {
                $location.path('/login');
            }
        } else {
            //Role Validations
            // if (authentication.role == 'Usuario' || authentication.role == '') {
            //     authService.logOut();
            //     setTimeout(function() {
            //         alertify.alert('Only Administrators have access to this application.').set('modal', true);
            //     }, 300);
            // }
        }

    });

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.activePath = $location.path();
    });


    $rootScope.logOut = function() {
        authService.logOut();
    };

});
