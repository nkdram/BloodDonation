(function () {
    'use strict';

    angular.module('esrimaps').controller('AddLocationController', ['$scope', '$uibModalInstance', 'items','$http','$location',
        function ($scope, $uibModalInstance, items, $http, $location) {

            var socket ;
            $scope.registered = false;
            var domainName = $location.protocol() + "://" + $location.host() + ":" + $location.port();
            require([  domainName+ '/socket.io/socket.io.js' ],function(socketFile){
                socket = socketFile.connect();

                $scope.verfiyPhone = function(){
                    $scope.credentials.latlng =
                        $scope.credentials.addressComponent.geometry.location.lat + ','
                        +$scope.credentials.addressComponent.geometry.location.lng;
                    $scope.credentials.bloodgroup  = $scope.credentials.bloodGroup.group;
                    $scope.credentials.address  = $scope.credentials.addressComponent.formatted_address;
                    //Storing Lat & Lng
                    $scope.credentials.lat =  $scope.credentials.addressComponent.geometry.location.lat.toFixed(5);
                    $scope.credentials.lng =  $scope.credentials.addressComponent.geometry.location.lng.toFixed(5);
                    if(!$scope.registered){
                        socket.emit("register", {
                            phone_number: $scope.credentials.phone,
                            donarData : $scope.credentials
                        });
                        $scope.loading = true;
                    }
                    else {
                        socket.emit("verify", {
                            code: $scope.credentials.phoneOTP,
                            donarData : $scope.credentials
                        });
                        $scope.loading = true;
                    }
                };

                socket.on("registered",function(data){
                    if(data.success) {
                        $scope.registered = true;
                    }
                    else
                    {
                        $scope.error = data.message;
                    }
                    $scope.loading = false; // Remove Loader once registration DONE
                    //Digest Registration
                    if (!$scope.$$phase){
                        $scope.$apply();
                    }
                });

                socket.on("verified",function(data){
                    if(data.success) {
                        $scope.verified = true;
                    }
                    else
                    {
                        $scope.error = data.message;
                    }
                    $scope.loading = false; // Remove Loader once Verification DONE
                    //Digest Verification
                    if (!$scope.$$phase){
                        $scope.$apply();
                        if($scope.verified === true){
                            $scope.addLocation();
                        }
                    }
                });

                socket.on("registerError",function(data){
                    $scope.verified = false;
                    $scope.error = data.message;
                    $scope.loading = false;
                    //Digest Error
                    if (!$scope.$$phase){
                        $scope.$apply();
                    }
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