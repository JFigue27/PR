'use strict';

/**
 * @ngdoc function
 * @name Main.controller:UserController
 * @description
 * # UserController
 * Controller of the Main
 */
angular.module('Main').controller('UserController', function($scope, formController, UserService) {
    var ctrl = new formController({
        scope: $scope,
        entityName: 'User',
        baseService: UserService,
        afterCreate: function(oEntity) {

        },
        afterLoad: function(oEntity) {

        }
    });
	
	ctrl.load();
});
