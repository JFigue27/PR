'use strict';

/**
 * @ngdoc function
 * @name Main.controller:PrLineListController
 * @description
 * # PrLineListController
 * Controller of the Main
 */
angular.module('Main').controller('PrLineListController', function($scope, listController, PrLineService, $routeParams) {

    var ctrl = new listController({
        scope: $scope,
        entityName: 'PrLine',
        baseService: PrLineService,
        afterCreate: function(oInstance) {

        },
        afterLoad: function() {
            if ($scope.baseList) {
                $scope.handleDynamicRows($scope.baseList);
            }
        },
        onOpenItem: function(oItem) {

        },
        filters: {

        }
    });

    ctrl.load("PurchaseRequestKey=" + $routeParams.id);

    $scope.handleDynamicRows = function(arrRows) {
        if (arrRows.length > 0) {
            var atLeastOneCellFilled = false;
            var lastRow = arrRows[arrRows.length - 1]
            for (var prop in lastRow) {
                if (lastRow.hasOwnProperty(prop)) {
                    if (prop == '$$hashKey' || prop == 'id') {
                        continue;
                    }
                    if (lastRow[prop] !== null && lastRow[prop] !== undefined && (lastRow[prop] > 0 || lastRow[prop].length > 0)) {
                        atLeastOneCellFilled = true;
                        break;
                    }
                }
            }
            if (!atLeastOneCellFilled) {
                return;
            }
        }

        arrRows.push({});
    };

});
