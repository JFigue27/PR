'use strict';

/**
 * @ngdoc function
 * @name Main.service:PrLineService
 * @description
 * # PrLineService
 * Service of the Main
 */
angular.module('Main').service('PrLineService', function(crudFactory) {

    var crudInstance = new crudFactory({
        
        entityName: 'PrLine',

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