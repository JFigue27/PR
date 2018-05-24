'use strict';

/**
 * @ngdoc directive
 * @name iqsApp.directive:comments
 * @description
 * # comments
 */
angular.module('iqsApp').directive('comments', function(crudFactory, $timeout, resize, $location) {
    
    // creata a servicee for angular called commentService
    
    var commentService = new crudFactory({
        //Entity Name = WebService/API endpoint to call:
        entityName: "Comment",

        

        parentField: 'ParentKey',

        catalogs: [],

        adapter: function(theEntity) {
            return theEntity;
        },

        adaptToServer: function(theEntity) {},

        dependencies: []
    });



    return {
        templateUrl: 'views/commentstemplate.html',
        restrict: 'E',
        // scope equals inputs
        scope: {
            ownerEntity: '=',
            customProperty: '@'
        },

        // methods inside component
        link: function postLink(scope, element, attrs) {

            var appKey = 1;

            scope.commentProperty = scope.customProperty || 'CommentKey';
            scope.theComment = {
                Comments: []
            };
            scope.commentToSave = commentService.create();

            var retrieveCurrentUser = function() {
                var theUser = {
                    id: 0,
                    Email: '',
                    Identicon: '',
                    Identicon64: '',
                    Phone1: '',
                    Phone2: '',
                    Role: '',
                    UserName: '',
                    Value: ''
                };
                if (scope.$parent.currentUser && scope.$parent.currentUser.id > -1) {
                    theUser = scope.$parent.currentUser;
                }

                if (theUser.id == 0) {
                    theUser.UserName = 'Anonymous';
                    theUser.Value = 'Anonymous';
                    theUser.Role = 'Anonymous';
                    theUser.Identicon64 = '';
                }
                return theUser;
            }
            scope.getIdenticon = function(theComment) {
                var result = 'images/anonymous.png';
                if (theComment.Identicon64.length > 0) {
                    result = 'data:image/bmp;base64,' + theComment.Identicon64;
                }
                return result;
            }
            var currentUser = retrieveCurrentUser();

            var save = function(commentToSave, parentComment) {
                commentService.save(commentToSave, null, '?link_src=' + escape($location.url())).then(function(data) {
                    parentComment.Comments.push(commentToSave);
                    parentComment.IsReplying = false;
                    scope.commentToSave = commentService.create();
                    resize.trigger();
                });
            };

            scope.addComment = function(currentComment) {
                if (currentComment.Comments === null) {
                    currentComment.Comments = [];
                }
                currentUser = retrieveCurrentUser();
                save({
                    id: 0,
                    ParentKey: currentComment[scope.commentProperty],
                    CommentText: scope.newComment,
                    CommentDate: new Date(),
                    CommentByUser: currentUser.id,
                    User: currentUser.Value,
                    Identicon64: currentUser.Identicon64
                }, scope.theComment);

                scope.newComment = '';
            };

            scope.reply = function(parentComment) {
                if (parentComment.Comments === null) {
                    parentComment.Comments = [];
                }
                currentUser = retrieveCurrentUser();
                save({
                    id: 0,
                    ParentKey: parentComment.id,
                    CommentText: this.replyText,
                    CommentDate: new Date(),
                    CommentByUser: currentUser.id,
                    User: currentUser.Value,
                    Identicon64: currentUser.Identicon64
                }, parentComment);
                this.replyText = '';
            };

            scope.showReply = function(that) {
                that.theComment.IsReplying = true;
            };
            // watch equals onChanged on angular 4
            scope.$watch(function() {
                return scope.ownerEntity;
            }, function(newValue, oldValue) {

                if (scope.ownerEntity && scope.ownerEntity[scope.commentProperty] > 0) {

                    refreshComments();

                    scope.CommentsRootKey = scope.ownerEntity[scope.commentProperty];

                    if (scope.currentCommentsRoom) {
                        LeaveComments();
                    }

                    JoinComments();

                } else {
                    scope.theComment = {
                        Comments: []
                    };
                }
            });



            function JoinComments(sSocketRoom) {

                scope.currentCommentsRoom = 'Comments_' + appKey + '_' + scope.CommentsRootKey;

                io.socket.on(scope.currentCommentsRoom, function(data) {
                    // switch (data.event) {
                    //     case 'updated':
                    refreshComments();
                    //         break;
                    // }
                });

                io.socket.get('/DocumentSync/JoinComments', {
                        ApplicationId: appKey,
                        CommentsRootKey: scope.CommentsRootKey
                    },
                    function(resData, jwres) {
                        if (resData.ErrorThrown) {
                            alertify.alert('Comments Module:<br>' + resData.ResponseDescription).set('modal', true);
                        }
                    });
            };

            function LeaveComments() {

                io.socket.get('/DocumentSync/LeaveComments', {
                    ApplicationId: appKey,
                    CommentsRootKey: scope.CommentsRootKey
                });

            };

            function refreshComments() {

                commentService.readByParentId(scope.ownerEntity[scope.commentProperty]).then(function(data) {
                    scope.theComment = {
                        // Comments: angular.copy(data)
                        Comments: [
                            {
                                "ParentKey": 23439,
                                "CommentText": "Que tranza",
                                "CommentDate": "2018-05-21T16:08:32",
                                "CommentByUser": 60,
                                "Comments": [
                                    {
                                        "ParentKey": 54436,
                                        "CommentText": "hello",
                                        "CommentDate": "2018-05-21T16:08:49",
                                        "CommentByUser": 2,
                                        "Comments": [
                                            {
                                                "ParentKey": 54437,
                                                "CommentText": "Otro reply",
                                                "CommentDate": "2018-05-22T13:22:01",
                                                "CommentByUser": 2,
                                                "Comments": [],
                                                "User": "Alfredo Pacheco",
                                                "Identicon64": "",
                                                "id": 54457,
                                                "AAA_EntityName": "Comment"
                                            }],
                                        "User": "Alfredo Pacheco",
                                        "Identicon64": "",
                                        "id": 54437,
                                        "AAA_EntityName": "Comment"
                                    }],
                                "User": "Erick Holguin",
                                "Identicon64": "",
                                "id": 54436,
                                "AAA_EntityName": "Comment"
                            },
                            {
                                "ParentKey": 23439,
                                "CommentText": "Another comment",
                                "CommentDate": "2018-05-21T16:08:59",
                                "CommentByUser": 2,
                                "Comments": [
                                    {
                                        "ParentKey": 54438,
                                        "CommentText": "Hi",
                                        "CommentDate": "2018-05-21T16:09:22",
                                        "CommentByUser": 60,
                                        "Comments": [],
                                        "User": "Erick Holguin",
                                        "Identicon64": "",
                                        "id": 54439,
                                        "AAA_EntityName": "Comment"
                                    }],
                                "User": "Alfredo Pacheco",
                                "Identicon64": "",
                                "id": 54438,
                                "AAA_EntityName": "Comment"
                            }]

                    };
                    resize.trigger();
                });

            };


        }
    };
}).directive('showFocus', function($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus,
            function(newValue) {
                $timeout(function() {
                    newValue && element.focus();
                });
            }, true);
    };
});