'use strict';

/**
 * @ngdoc directive
 * @name Main.directive:PurchaseRequest
 * @description
 * # PurchaseRequest
 */
angular.module('Main').directive('purchaseRequestForm', function() {
    return {
        templateUrl: 'components/PurchaseRequest/purchase.request.form.html',
        restrict: 'E',
        controller: function($scope, formController, $mdDialog, PurchaseRequestService, $routeParams) {

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

            $scope.$on('load-modal-PurchaseRequest', function(scope, oPurchaseRequest) {
                refresh(oPurchaseRequest);
            });

            $scope.$on('ok-modal-PurchaseRequest', function() {
                $scope.baseEntity.editMode = true;
                return ctrl.save().then(function() {
                    $mdDialog.hide();
                    alertify.success('Saved Successfully.');
                });
            });

            function refresh(oPurchaseRequest) {
                ctrl.load(oPurchaseRequest);
            }

            ctrl.load($routeParams.id);

            $scope.save = function() {
                $scope.baseEntity.editMode = true;
                ctrl.save().then(function() {
                    $scope.$broadcast('load-PRLines');
                    alertify.success('Saved Successfully.');
                });
            };

            $scope.print = function() {
                window.open("reports/purchase-request.html");
            };
        }
    };
});
