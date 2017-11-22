'use strict';

/**
 * @ngdoc function
 * @name Main.controller:MainController
 * @description
 * # MainController
 * Controller of the Main
 */
angular.module('Main').controller('MainController', function($scope, $mdSidenav, $timeout) {

    $scope.toggleMainSideNav = buildToggler('main-sidenav');

    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
        };
    }

    $timeout(function() {
        $('#mainSection').css('visibility', 'visible');
    });

});
