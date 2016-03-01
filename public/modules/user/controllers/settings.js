(function () {
    'use strict';

    angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
        function ($scope, $http, $location, Users, Authentication) {
            $scope.user = Authentication.user;


            // If user is not signed in then redirect back home
            /*if (!$scope.user) {
                $location.path('/');
            }*/

            // Define the User roles:
            $scope.roles = ['admin', 'user'];
            $scope.defroles = $scope.roles[0];
            $scope.find = function () {
                Users.query().$promise.then(function (data) {
                    $scope.users = data;
                    var lookup = {};
                    //var items = data;
                    $scope.roleTypes = ['All Contacts'];
                    angular.forEach(data, function (user) {
                        var name = user.roles;
                        if (!(name in lookup)) {
                            lookup[name] = 1;
                            $scope.roleTypes.push(name.charAt(0).toUpperCase() + name.slice(1));
                        }
                    });

                    $scope.currentRole = 'All Contacts';
                });
            };
            $scope.view = 'view';
            $scope.searchText = '';
            $scope.selectedRoleIndex = 0;
            $scope.selectedUserIndex = 0;

            /**
             * Loads the user by selected role
             *
             * @param role
             * @param index
             */
            $scope.setCurrentRole = function (role, index) {
                $scope.currentRole = role;
                $scope.currentUserId = null;
                $scope.view = 'view';
                $scope.selectedRoleIndex = index;
            };

            /**
             * Loads the current user
             *
             * @param user
             * @param index
             */
            $scope.setCurrentUser = function (user, index) {
                $scope.currentUserId = user;
                $scope.view = 'view';
                $scope.user = user;
                $scope.selectedUserIndex = index;
            };

            /**
             * Filter users based on role
             *
             * @param item
             * @returns {boolean}
             */
            $scope.roleFilter = function (item) {
                if (item.roles === $scope.currentRole.toLowerCase()) {
                    $scope.defroles = item.roles;
                }
                return (
                    ($scope.currentRole === 'All Contacts' || item.roles === $scope.currentRole.toLowerCase()) && ($scope.searchText ? item.displayName.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1 : true)
                );
            };

            $scope.userFilter = function (item) {
                var condition = $scope.currentUserId ? item.id === $scope.currentUserId.id : ($scope.filteredUsers ? item.id === $scope.filteredUsers[0].id : false);
                if (condition) {
                    $scope.user = $scope.currentUserId ? $scope.currentUserId : $scope.filteredUsers[0];
                }
                return condition;
            };

            $scope.signup = function () {
                $scope.credentials.roles = $scope.defroles;
                $http.post('/auth/signup', $scope.credentials).success(function (response) {
                    // If successful we assign the response to the global user model
                    //$scope.authentication.user = response;
                    $scope.find();
                    $scope.credentials = {};
                    // And redirect to the index page
                    $location.path('/users');
                }).error(function (response) {
                    $scope.error = response.message;
                });
            };

            //Disable/Enable user
            $scope.activateUser = function (active) {
                $scope.user.active = active === '1' ? '0' : '1';
                console.log($scope.user);
                $scope.updateUserProfile(true, false);
            };

            // Update a user profile
            $scope.updateUserProfile = function (isValid, reload) {
                if (isValid) {
                    $scope.success = $scope.error = null;
                    var user = new Users($scope.user);
                    Users.update({
                        updateUserId: user.id
                    }, user, function (response) {
                        $scope.success = true;
                        //Authentication.user = response;
                        if (reload) {
                            $scope.find();
                        }
                    }, function (response) {
                        $scope.error = response.data.message;
                    });
                } else {
                    $scope.submitted = true;
                }
            };

            // Change user password
            $scope.changeUserPassword = function () {
                $scope.success = $scope.error = null;
                $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                    // If successful show success message and clear form
                    $scope.success = true;
                    $scope.passwordDetails = null;
                }).error(function (response) {
                    $scope.error = response.message;
                });
            };
        }
    ]);
})();
