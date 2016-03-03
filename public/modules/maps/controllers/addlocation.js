(function () {
    'use strict';

    angular.module('esrimaps').controller('AddLocationController', ['$scope', '$uibModalInstance', 'items','$http',
        function ($scope, $uibModalInstance, items, $http) {

            var socket ;
            require([ 'http://localhost:8079/socket.io/socket.io.js' ],function(socketFile){
                socket = socketFile.connect();

                $scope.verfiyPhone = function(){
                    socket.emit("register", {
                        phone_number: $scope.credentials.phone
                    });
                };

                socket.on("verified",function(data){
                    $scope.verified = true;
                });

            });

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.map = items;
            $scope.credentials = {};
            $scope.bloodgroups = [
                {group:'A +ve' ,code:'A +ve'},
                {group:'B +ve' ,code:'B +ve'},
                {group:'O +ve' ,code:'O +ve'},
                {group:'AB +ve' ,code:'AB +ve'},
                {group:'A -ve' ,code:'A -ve'},
                {group:'B -ve' ,code:'B -ve'},
                {group:'O -ve' ,code:'O -ve'},
                {group:'AB -ve' ,code:'AB -ve'}
            ];

            $scope.addresses = [];
            $scope.refreshAddresses = function(address) {
                var params = {address: address, sensor: false};
                return $http.get(
                    'http://maps.googleapis.com/maps/api/geocode/json',
                    {params: params}
                ).then(function(response) {
                    $scope.addresses = response.data.results;
                    if($scope.addresses && $scope.addresses.length === 1)
                    {
                        $scope.credentials.addressComponent = $scope.addresses[0];
                    }
                    if($scope.credentials.addressComponent)
                    {
                        $scope.location = $scope.credentials.addressComponent.geometry.location;
                    }
                });
            };

            $scope.verified = false;
            $scope.addLocation = function(){
                if(!$scope.verified) {
                    $scope.verfiyPhone();
                }
                else {
                    var lineAtt = {
                        Name: $scope.credentials.firstName + ' ' + $scope.credentials.lastName,  //The name of the pipeline
                        BloodGroup: $scope.credentials.bloodGroup.group,  //The owner of the pipeline
                        Phone: $scope.credentials.phone
                    };
                    $scope.map.loadMarker($scope.credentials.addressComponent.geometry.location.lat, $scope.credentials.addressComponent.geometry.location.lng, null, lineAtt);
                    $uibModalInstance.close();
                }
            };

            $scope.loadDefaultLocation = function(){
                var params = {latlng: $scope.map.latlng, sensor: false};
                $http.get(
                    'http://maps.googleapis.com/maps/api/geocode/json',
                    {params: params}
                ).then(function(response) {
                    $scope.addresses = response.data.results;
                    if($scope.addresses && $scope.addresses.length > 1)
                    {
                        $scope.credentials.addressComponent = $scope.addresses[0];
                    }
                });
            };
        }]);
})();