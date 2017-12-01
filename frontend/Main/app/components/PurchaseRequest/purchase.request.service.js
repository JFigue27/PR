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

            if (theEntity.arrPRLines && theEntity.arrPRLines.length > 0) {
                theEntity.PRLines = angular.copy(theEntity.arrPRLines);
                for (var i = theEntity.PRLines.length - 1; i >= 0; i--) {
                    var current = theEntity.PRLines[i];
                    if (current.ItemNumber ||
                        current.Description ||
                        current.UM ||
                        current.Qty ||
                        current.PriceEach
                    ) {} else {
                        theEntity.PRLines.splice(i, 1);
                    }
                }
            }

        },

        dependencies: [

        ]
    });

    return crudInstance;
});
