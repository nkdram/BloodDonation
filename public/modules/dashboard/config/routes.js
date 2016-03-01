(function () {
    'use strict';

    // Setting up route
    angular.module('dashboard').config(['$stateProvider',
        function ($stateProvider) {
            // Users state routing
            $stateProvider.
                state('dashboard', {
                    url: '/dashboard',
                    templateUrl: '/assets/modules/dashboard/views/dashboard.html'
                })

        }
    ]);
})();

