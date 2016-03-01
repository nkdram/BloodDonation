(function () {
    'use strict';

    angular.module('core').controller('HeaderController', ['$scope','Users', 'Authentication', 'Menus', 'ReturnUrl','$location','$window',
        function ($scope, Users, Authentication, Menus, ReturnUrl,$location, $window) {
            $scope.authentication = Authentication;
            $scope.isCollapsed = false;

            $scope.menu = $scope.authentication.user ? true : false; //Menus.getMenu('topbar');

            if(!$scope.menu)
            {
                $location.path('/signin');

            }
            // Toggle the menu items
            $scope.isCollapsed = false;
            $scope.toggleCollapsibleMenu = function () {
                $scope.isCollapsed = !$scope.isCollapsed;
            };

            // Collapsing the menu after navigation
            $scope.$on('$stateChangeSuccess', function () {
                $scope.isCollapsed = false;
            });

            $scope.signout = function () {
                Users.signout().$promise.then(function(response){
                    $location.path('/signin');
                    $window.location.reload();
                });

            };


            ReturnUrl.return();
        }
    ]);
})();
