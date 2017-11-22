'use strict';

/**
 * @ngdoc function
 * @name Main.service:UserService
 * @description
 * # UserService
 * Service of the Main
 */
angular.module('Main').service('UserService', function(crudFactory) {

    var crudInstance = new crudFactory({
        
        entityName: 'User',

        catalogs: [],

        adapter: function(theEntity) {
            return theEntity;
        },

        adapterIn: function(theEntity) {

        },

        adapterOut: function(theEntity, self) {

        },

        dependencies: [

        ]
    });

    return crudInstance;
});