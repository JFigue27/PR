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
        restrict: 'E',
        controller: function($scope, listController, $mdDialog, $rootScope, PrLineService) {

            var listCtrl = new listController({
                scope: $scope,
                entityName: 'PrLine',
                baseService: PrLineService,
                afterCreate: function(oInstance, oEvent) {
                    $mdDialog.show({
                        title: 'PrLine',
                        contentElement: '#modal-PrLine',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        multiple: true,
                        fullscreen: true,
                        targetEvent: oEvent,
                        onRemoving: function(element, removePromise) {
                            listCtrl.load();
                        }
                    });

                    $rootScope.$broadcast('load-modal-PrLine', oInstance);
                },
                afterLoad: function() {

                },
                onOpenItem: function(oEntity, oEvent) {
                    $mdDialog.show({
                        title: 'PrLine',
                        contentElement: '#modal-PrLine',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        multiple: true,
                        fullscreen: true,
                        targetEvent: oEvent,
                        onRemoving: function(element, removePromise) {
                            listCtrl.load();
                        }
                    });

                    $rootScope.$broadcast('load-modal-PrLine', oEntity);
                },
                filters: []
            });

            $scope.$on('load_PrLine', function(scope) {
                listCtrl.load();
            });

            listCtrl.load();
        }
    };
});
