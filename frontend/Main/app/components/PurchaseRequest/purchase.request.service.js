'use strict';

/**
 * @ngdoc function
 * @name Main.service:PurchaseRequestService
 * @description
 * # PurchaseRequestService
 * Service of the Main
 */
angular.module('Main').service('PurchaseRequestService', function(crudFactory, utilsService) {

    var crudInstance = new crudFactory({
        
        entityName: 'PurchaseRequest',

        catalogs: [],

        adapter: function(theEntity) {
            theEntity.ConvertedDateDepartmentManager = utilsService.toJavascriptDate(theEntity.DateDepartmentManager);
            theEntity.ConvertedDateGeneralManager = utilsService.toJavascriptDate(theEntity.DateGeneralManager);
            return theEntity;
        },

        adapterIn: function(theEntity) {

        },

        adapterOut: function(theEntity, self) {
            theEntity.DateDepartmentManager = utilsService.toServerDate(theEntity.ConvertedDateDepartmentManager);
            theEntity.DateGeneralManager = utilsService.toServerDate(theEntity.ConvertedDateGeneralManager);
        },

        dependencies: [

        ]
    });

    return crudInstance;
});