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
            state('default', {
                url: '/',
                templateUrl: '/assets/modules/maps/views/find.html'
            })

        }
    ]);
})();

