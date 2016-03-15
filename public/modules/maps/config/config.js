(function () {
    'use strict';

    // Setting up route
    angular.module('esrimaps').config(['$stateProvider',
        function ($stateProvider) {
            // Users state routing
            $stateProvider.
            state('esrimaps', {
                url: '/find',
                templateUrl: '/assets/modules/maps/views/find.html'
            }).
            state('defaulState', {
                url: '',
                templateUrl: '/assets/modules/maps/views/find.html'
            }).state('activate',{
                url:'/activate',
                templateUrl:'/assets/modules/maps/views/activate.html'
            })

        }
    ]);
})();

