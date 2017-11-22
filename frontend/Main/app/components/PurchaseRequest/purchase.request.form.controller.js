'use strict';

/**
 * @ngdoc function
 * @name Main.controller:PurchaseRequestController
 * @description
 * # PurchaseRequestController
 * Controller of the Main
 */
angular.module('Main').controller('PurchaseRequestController', function($scope, formController, PurchaseRequestService) {
    
    var ctrl = this;

    formController.call(this, {
        scope: $scope,
        entityName: 'PurchaseRequest',
        baseService: PurchaseRequestService,
        afterCreate: function(oEntity) {

        },
        afterLoad: function(oEntity) {

        }
    });
	
	ctrl.load();
});
