'use strict';

/**
 * @ngdoc directive
 * @name Main.directive:PrLine
 * @description
 * # PrLine
 */
angular.module('Main').directive('prLineForm', function() {
    return {
        templateUrl: 'components/PrLine/pr.line.form.html',
        restrict: 'E',
        controller: function($scope, formController, $mdDialog, PrLineService) {

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

            $scope.$on('load-modal-PrLine', function(scope, oPrLine) {
                refresh(oPrLine);
            });

            $scope.$on('ok-modal-PrLine', function() {
                $scope.baseEntity.editMode = true;
                return ctrl.save().then(function() {
                    $mdDialog.hide();
                    alertify.success('Saved Successfully.');
                });
            });

            function refresh(oPrLine) {
                ctrl.load(oPrLine);
            }

        }
    };
});
