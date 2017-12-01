'use strict';

/**
 * @ngdoc directive
 * @name Main.directive:PrLine
 * @description
 * # PrLine
 */
angular.module('Main').directive('prLineList', function() {
    return {
        templateUrl: 'components/PrLine/pr.line.list.html',
        restrict: 'A',
        replace: true,
        scope: {
            purchaseRequestKey: '=',
            pr: '='
        },
        controller: function($scope, listController, $mdDialog, $rootScope, PrLineService) {

            var listCtrl = new listController({
                scope: $scope,
                entityName: 'PrLine',
                baseService: PrLineService,
                afterCreate: function(oInstance, oEvent) {

                },
                afterLoad: function() {
                    if ($scope.baseList) {
                        $scope.handleDynamicRows($scope.baseList);
                    }
                },
                onOpenItem: function(oEntity, oEvent) {

                },
                filters: []
            });

            $scope.$on('load-PRLines', function() {
                refresh();
            });

            function refresh() {
                listCtrl.load('PurchaseRequestKey=' + $scope.purchaseRequestKey);
            }

            $scope.$watch(function() {
                return $scope.purchaseRequestKey;
            }, function() {
                if ($scope.purchaseRequestKey > 0) {
                    refresh();
                }
            });

            $scope.$watchCollection('baseList', function() {
                if ($scope.pr) {
                    $scope.pr.arrPRLines = $scope.baseList;
                }
            });

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

            $scope.removeItemLocally = function(index) {
                $scope.baseList.splice(index, 1);
            }
        }
    };
});
