'use strict';

/**
 * @ngdoc function
 * @name Main.controller:PurchaseRequestListController
 * @description
 * # PurchaseRequestListController
 * Controller of the Main
 */
angular.module('Main').controller('PurchaseRequestListController', function($scope, listController, PurchaseRequestService, $routeParams) {

    var ctrl = new listController({
        scope: $scope,
        entityName: 'PurchaseRequest',
        baseService: PurchaseRequestService,
        afterCreate: function(oInstance) {

        },
        afterLoad: function() {

        },
        onOpenItem: function(oItem) {

        },
        filters: {

        }
    });



});
