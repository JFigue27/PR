'use strict';

/**
 * @ngdoc directive
 * @name Main.directive:modal
 * @description
 * # modal
 */
angular.module('Main').directive('modal', function() {
    return {
        template: `<div style="display: none;">
                        <div class="md-dialog-container" id="{{modalId}}">
                            <md-dialog aria-label="Dialog" flex="80" layout="column" style="height: 80%;" ng-style="{'max-width': maxWidth}">
                                <md-toolbar ng-if="title">
                                  <div class="md-toolbar-tools">
                                    <h2>{{title}}</h2>
                                  </div>
                                </md-toolbar>
                                <div ng-transclude="header"></div>
                                <md-dialog-content flex>
                                    <div class="md-dialog-content" flex>
                                        <div ng-transclude="body" flex></div>
                                    </div>
                                </md-dialog-content>
                                <md-dialog-actions layout="row" layout-align="end end" style="border-top: 1px solid rgba(0,0,0,0.12);">
                                    <md-button ng-click="close_modal()" class="">Close</md-button>
                                    <md-button ng-click="ok_click()" class="">{{okLabel}}</md-button>
                                </md-dialog-actions>
                            </md-dialog>
                        </div>
                    </div>`,
        restrict: 'E',
        transclude: {
            header: '?modalHeader',
            body: 'modalBody'
        },
        replace: false,
        scope: {
            modalId: '@',
            okLabel: '@',
            maxWidth: '=',
            title: '@'
        },
        controller: function($scope, $mdDialog) {
            $scope.baseEntity = {};

            $scope.ok_click = function() {
                $scope.$broadcast('ok-' + $scope.modalId);
            };

            $scope.close_modal = function() {
                $mdDialog.hide();
                $scope.$broadcast('unload-' + $scope.modalId);
            };
        }
    };
});
