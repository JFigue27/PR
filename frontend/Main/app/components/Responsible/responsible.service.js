'use strict';

/**
 * @ngdoc function
 * @name Main.service:ResponsibleService
 * @description
 * # ResponsibleService
 * Service of the Main
 */
angular.module('Main').service('ResponsibleService', function(crudFactory, utilsService) {

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