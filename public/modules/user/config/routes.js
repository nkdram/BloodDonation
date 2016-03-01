(function () {
    'use strict';

    // Setting up route
    angular.module('users').config(['$stateProvider',
        function ($stateProvider) {
            // Users state routing
            $stateProvider.
                state('listUsers', {
                    url: '/users',
                    templateUrl: '/assets/modules/users/views/settings/list-users.client.view.html'
                })
                /*.
                state('profile', {
                    url: '/settings/profile',
                    templateUrl: '/assets/modules/users/views/settings/edit-profile.client.view.html'
                })*/
                .
                state('password', {
                    url: '/settings/password',
                    templateUrl: '/assets/modules/user/views/changepassword.html'
                }).
                state('createUser', {
                    url: '/signup',
                    templateUrl: '/assets/modules/user/views/signup.html'
                }).
                state('signin', {
                    url: '/signin',
                    templateUrl: '/assets/modules/user/views/signin.client.view.html'
                }).
                state('forgot', {
                    url: '/password/forgot',
                    templateUrl: '/assets/modules/user/views/forgotpassword.html'
                }).
                state('reset-invlaid', {
                    url: '/password/reset/invalid',
                    templateUrl: '/assets/modules/users/views/password/reset-password-invalid.client.view.html'
                }).
                state('reset-success', {
                    url: '/password/reset/success',
                    templateUrl: '/assets/modules/users/views/password/reset-password-success.client.view.html'
                }).
                state('reset', {
                    url: '/password/reset/:token',
                    templateUrl: '/assets/modules/users/views/password/reset-password.client.view.html'
                });
        }
    ]);
})();
