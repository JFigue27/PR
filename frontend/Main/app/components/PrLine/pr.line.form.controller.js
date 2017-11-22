'use strict';

/**
 * @ngdoc function
 * @name Main.controller:PrLineController
 * @description
 * # PrLineController
 * Controller of the Main
 */
angular.module('Main').controller('PrLineController', function($scope, formController, PrLineService) {
    
    var ctrl = this;

    formController.call(this, {
        scope: $scope,
        entityName: 'PrLine',
        baseService: PrLineService,
        afterCreate: function(oEntity) {

        },
        afterLoad: function(oEntity) {

        }
    });
	
	ctrl.load();
});
