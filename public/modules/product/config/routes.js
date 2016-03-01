(function () {
    'use strict';

    // Setting up route
    angular.module('dashboard').config(['$stateProvider',
        function ($stateProvider) {
            // Users state routing
            $stateProvider.
                state('productupload', {
                    url: '/products',
                    templateUrl: '/assets/modules/product/views/products.html'
                })

        }
    ]);
})();
