'use strict';

/**
 * @ngdoc function
 * @name Main.controller:UserListController
 * @description
 * # UserListController
 * Controller of the Main
 */
angular.module('Main').controller('UserListController', function($scope, listController, UserService) {

    var ctrl = new listController({
        scope: $scope,
        entityName: 'User',
        baseService: UserService,
        afterCreate: function(oInstance) {

        },
        afterLoad: function() {

        },
        onOpenItem: function(oItem) {

        },
        filters: {
            
        }
    });

    ctrl.load();

});
