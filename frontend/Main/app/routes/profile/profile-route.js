'use strict';

/**
 * @ngdoc function
 * @name Main.controller:profileController
 * @description
 * # profileController
 * Controller of the Main
 */
angular.module('Main').controller('ProfileController', function($scope, formController, userService, $rootScope, $timeout) {

    var ctrl = new formController({
        scope: $scope,
        entityName: 'User',
        baseService: userService
    });

    $timeout(function() {
        ctrl.load($rootScope.currentUser);
    }, 500);

    $scope.sendTestEmail = function(oUser) {
        userService.sendTestEmail(oUser).then(function() {
            alertify.success('Email sent successfully.');
        });
    };
});
