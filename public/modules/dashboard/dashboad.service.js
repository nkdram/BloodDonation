/*
(function () {
    'use strict';

// Users service used for communicating with the users REST endpoint
    angular.module('dashboard').factory('Dashboard', ['$resource',
        function ($resource) {
            return $resource('dashboard', {}, {
                listCategorizedProducts:{
                    method:'GET',
                    url:'list'
                }
            });
        }
    ]);
})();*/
