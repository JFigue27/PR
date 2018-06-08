'use strict';

/**
 * @ngdoc directive
 * @name iqsApp.directive:comments
 * @description
 * # comments
 */
angular.module('iqsApp').directive('comments', function(crudFactory, $timeout, resize, $location) {
    var commentService = new crudFactory({
        //Entity Name = WebService/API endpoint to call:
        entityName: "Comment",

        //Entity Definition
        entityDefinition: {
            systemFields: {
                id: 'catalog',
                ParentKey: 'catalog',
                CommentDate: 'date',
                CommentByUser: 'catalog',
            },

            calculatedFields: {},

            optionalFields: {},

            requiredFields: {
                CommentText: 'string'
            }
        },

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
        scope: {
            //INPUTS
            ownerEntity: '=',
            customProperty: '@'
        },
        link: function postLink(scope, element, attrs) {
            //LOCAL VARIABLE
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

            scope.$watch(function() {
                return scope.ownerEntity;
            }, function(newValue, oldValue) {
                if (scope.ownerEntity && scope.ownerEntity[scope.commentProperty] > 0) {

                    refreshComments();

                    scope.CommentsRootKey = scope.ownerEntity[scope.commentProperty];

                    

                } else {
                    scope.theComment = {
                        Comments: []
                    };
                }
            });



            
            function refreshComments() {

                commentService.readByParentId(scope.ownerEntity[scope.commentProperty]).then(function(data) {
                    scope.theComment = {
                        Comments: angular.copy(data)
                    };
                    resize.trigger();
                });

            };


        }
    };
})