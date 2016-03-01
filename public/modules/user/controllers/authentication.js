(function () {
    'use strict';

    angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'ReturnUrl','$window',
        function ($scope, $http, $location, Authentication, ReturnUrl,$window) {
            $scope.authentication = Authentication;

            // If user is signed in then redirect back home
            if ($scope.authentication.user)
                $location.path('/dashboard');

            $scope.signin = function () {
                $http.post('/auth/signin', $scope.credentials).success(function (response) {
                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;

                    // And redirect to the index page
                    if (!ReturnUrl.return()) {
                        $location.path('/dashboard');
                        console.log('IN STATE RELOAD');
                        $window.location.reload();
                    }
                }).error(function (response) {
                    $scope.error = response.message;
                });
            };

            $scope.navigate = function(){
                $location.path('/signup');
            };
            $scope.closeError = function () {
                $scope.error = '';
            };
        }
    ]);
})();