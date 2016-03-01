(function () {
    'use strict';

    angular.module('esrimaps').controller('AddLocationController', ['$scope', '$uibModalInstance', 'items','$http',
        function ($scope, $uibModalInstance, items, $http) {

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

            $scope.addLocation = function(){
                var lineAtt = {
                    Name: $scope.credentials.firstName + ' '+ $scope.credentials.lastName,  //The name of the pipeline
                    BloodGroup: $scope.credentials.bloodGroup.group,  //The owner of the pipeline
                    Phone: $scope.credentials.phone
                };
                $scope.map.loadMarker($scope.credentials.addressComponent.geometry.location.lat,$scope.credentials.addressComponent.geometry.location.lng,null,lineAtt);
                $uibModalInstance.close();
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



            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);
})();