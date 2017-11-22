'use strict';

/**
 * @ngdoc directive
 * @name Main.directive:PurchaseRequest
 * @description
 * # PurchaseRequest
 */
angular.module('Main').directive('purchaseRequestList', function() {
    return {
        templateUrl: 'components/PurchaseRequest/purchase.request.list.html',
        restrict: 'E',
        controller: function($scope, listController, $mdDialog, $rootScope, PurchaseRequestService) {

            var listCtrl = new listController({
                scope: $scope,
                entityName: 'PurchaseRequest',
                baseService: PurchaseRequestService,
                afterCreate: function(oInstance, oEvent) {
                    var confirm = $mdDialog.confirm()
                        .title('PO')
                        .textContent('Please confirm to create a new Purchase Request Document.')
                        .targetEvent(oEvent)
                        .multiple(true)
                        .ok('OK')
                        .cancel('Cancel')
                        .clickOutsideToClose(false)
                        .escapeToClose(false);

                    $mdDialog.show(confirm).then(function() {

                        $scope.saveItem(oInstance).then(function(oEntity) {
                            listCtrl.go('/pr?id=' + oEntity.id);
                        });

                    });
                },
                afterLoad: function() {

                },
                onOpenItem: function(oEntity, oEvent) {
                    listCtrl.go('/pr?id=' + oEntity.id);
                },
                filters: []
            });

            $scope.$on('load_PurchaseRequest', function(scope) {
                listCtrl.load();
            });

            listCtrl.load();
        }
    };
});
