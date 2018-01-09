'use strict';

/**
 * @ngdoc directive
 * @name Main.directive:attachmentsBox
 * @description
 * # attachmentsBox
 */
angular.module('Main').directive('attachmentsBox', function(FileUploader, appConfig, $http, $timeout, $q) {
    return {
        restrict: 'E',
        scope: {
            ownerEntity: '=',
            printmode: '=',
            kind: '@',
            readOnly: '=',
            whenChange: '&',
            afterDelete: '&',
            customListBind: '@',
            customFolderBind: '@'
        },
        template: `<div nv-file-drop nv-file-over uploader="uploader" class="AttachmentsBox" over-class="UploaderOverClass" ng-click="$event.stopPropagation();" ng-dblclick="addAttachment();$event.stopPropagation();">
                    <input type="file" nv-file-select uploader="uploader" multiple style="display:none;" />
                    <div class="noselect" ng-show="ownerEntity[attachmentsList].length==0 || ownerEntity[attachmentsList] == null">
                        No files.
                    </div>
                    <p class="input-group noselect" ng-repeat="attachment in ownerEntity[attachmentsList]">
                        <a ng-hide="attachment.isForUpload"
                            ng-href="{{baseURL}}attachment_download?directory={{attachment.Directory}}&fileName={{attachment.FileName}}&attachmentKind={{kind}}"
                            href=""
                            class="pull-left"
                            ng-style="{'text-decoration': attachment.ToDelete ? 'line-through': '', color:attachment.ToDelete ? 'red': ''}"
                            >{{attachment.FileName}}</a>
                        <span ng-show="attachment.isForUpload" class="glyphicon glyphicon-upload pull-left"></span>
                        <button ng-show="attachment.isForUpload" class="btn-link pull-left">{{attachment.FileName}}</button>
                        <span class="btn glyphicon glyphicon-remove pull-right btn-sm" ng-hide="printmode || readOnly || attachment.ToDelete" ng-click="removeAttachment(attachment, $index);$event.stopPropagation();"></span>
                        <span class="btn btn-xs btn-link pull-right" style="color: red;padding: 0;" ng-hide="printmode || readOnly || !attachment.ToDelete" ng-click="cancelRemove($index);$event.stopPropagation();">(cancel remove)</span>
                    </p>
                    <button type="button" ng-hide="readOnly" class="btn btn-success btn-xs hidden-print" ng-click="addAttachment();$event.stopPropagation();">Add File</button>
                </div>`,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.uploader = new FileUploader();
                    scope.attachmentsList = scope.customListBind || 'Attachments';
                    scope.attachmentsFolder = scope.customFolderBind || 'AttachmentsFolder';

                    //When user selects a file from browser:
                    scope.uploader.onAfterAddingFile = function(fileItem) {
                        if (!scope.ownerEntity[scope.attachmentsList]) {
                            scope.ownerEntity[scope.attachmentsList] = [];
                        }
                        scope.ownerEntity[scope.attachmentsList].push({
                            FileName: fileItem.file.name,
                            Directory: (scope.ownerEntity[scope.attachmentsFolder] || ''),
                            isForUpload: true
                        });
                        scope.whenChange({
                            oEntity: scope.ownerEntity
                        });
                    };
                    scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
                        // console.debug(item);
                        // console.debug(filter);
                        // console.debug(options);
                    };
                    //A single file was uploaded successfully.
                    scope.uploader.onSuccessItem = function(item, response, status, headers) {
                        var backendResponse = response;
                        if (!backendResponse.ErrorThrown) {
                            scope.ownerEntity[scope.attachmentsFolder] = backendResponse.ResponseDescription;
                            var theAttachment = scope.getAttachment(item.file.name);
                            theAttachment.isForUpload = false;
                        } else {
                            scope.ErrorThrown = true;
                            alertify.alert(backendResponse.ResponseDescription).set('modal', true);
                            console.debug(response);
                        }
                    };
                    scope.uploader.onErrorItem = function(item, response, status, headers) {
                        console.debug(item);
                        console.debug(response);
                        console.debug(status);
                    };

                    //All files where uploaded to backend successfully:
                    scope.uploader.onCompleteAll = function() {
                        if (!scope.ErrorThrown) {
                            scope.uploading.resolve();
                        } else {
                            scope.uploading.reject();
                        }
                    };
                    scope.uploader.onBeforeUploadItem = function(item) {
                        item.url = appConfig.API_URL + 'attachment?attachmentKind=' + (scope.kind || '') + '&targetFolder=' + (scope.ownerEntity[scope.attachmentsFolder] || '')
                    };
                },
                post: function(scope, iElement, iAttrs) {
                    scope.baseURL = appConfig.API_URL;
                    scope.$watch(function() {
                        return scope.ownerEntity;
                    }, function() {
                        if (scope.ownerEntity) {
                            var apiName = 'api_attachments';
                            if (scope.customListBind) {
                                apiName = 'api_' + scope.customListBind;
                            }
                            scope.ownerEntity[apiName] = {};
                            scope.ownerEntity[apiName].uploadFiles = function() {
                                scope.uploading = $q.defer();
                                scope.ErrorThrown = false;
                                if (scope.uploader.getNotUploadedItems().length > 0) {
                                    scope.uploader.uploadAll();
                                } else {
                                    scope.uploading.resolve();
                                }
                                return scope.uploading.promise;
                            };
                            scope.ownerEntity[apiName].clearQueue = function() {
                                scope.uploader.clearQueue();
                            };
                        }
                    }, false);
                    scope.theElement = iElement;

                    //User clicks "X" to one of the files.
                    scope.removeAttachment = function(attachment, index) {

                        if (attachment.isForUpload) {
                            scope.uploader.removeFromQueue(scope.getItem(attachment.FileName));
                            scope.ownerEntity[scope.attachmentsList].splice(index, 1);
                        } else {
                            scope.ownerEntity[scope.attachmentsList][index].ToDelete = true;
                            // alertify.confirm(
                            //     'This action cannot be undo, do you want to continue?',
                            //     function() {
                            //         scope.$apply(function() {
                            //             $http.get(appConfig.API_URL + 'attachment_delete?directory=' + attachment.Directory + '&fileName=' + attachment.FileName + '&attachmentKind=' + scope.kind).then(function(data) {
                            //                 var backendResponse = data;
                            //                 if (!backendResponse.ErrorThrown) {
                            //                     scope.ownerEntity[scope.attachmentsList].splice(index, 1);
                            //                     $timeout(function() {
                            //                         alertify.success('File deleted successfully.');
                            //                     }, 100);
                            //                 } else {
                            //                     alertify.alert('An error has occurried, see console for more details.').set('modal', true);
                            //                     console.debug(response);
                            //                 }
                            //                 scope.afterDelete({
                            //                     oEntity: scope.ownerEntity
                            //                 });
                            //             }, function(data) {
                            //                 alertify.alert('An error has occurried, see console for more details.').set('modal', true);
                            //                 console.debug(data);
                            //             });
                            //         });
                            //     });
                        }
                    };
                    scope.cancelRemove = function(index) {
                        scope.ownerEntity[scope.attachmentsList][index].ToDelete = false;
                    };
                    scope.getItem = function(sName) {
                        for (var i = 0; i < scope.uploader.queue.length; i++) {
                            if (scope.uploader.queue[i].file.name == sName) {
                                return scope.uploader.queue[i];
                            }
                        }
                        return null;
                    };
                    //When click "Add File":
                    scope.addAttachment = function() {
                        if (!scope.readOnly) {
                            $timeout(function() {
                                scope.theElement.find('input[type="file"]').click();
                            });
                        }
                    };
                    scope.getAttachment = function(sName) {
                        for (var i = 0; i < scope.ownerEntity[scope.attachmentsList].length; i++) {
                            if (scope.ownerEntity[scope.attachmentsList][i].FileName == sName) {
                                return scope.ownerEntity[scope.attachmentsList][i];
                            }
                        }
                        return null;
                    };
                }
            };
        }
    };
});
