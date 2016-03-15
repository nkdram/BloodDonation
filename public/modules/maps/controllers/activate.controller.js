(function () {
    'use strict';

    angular.module('esrimaps').controller('ActivateController', ['$scope', '$http', '$location','esriLoader','$window',
        function ($scope, $http, $location,esriLoader,$window) {

            var search = $location.search();
            var url = search.uid;
            $scope.isValid = true; $scope.loading = true;

            var socket ;
            var domainName = $location.protocol() + "://" + $location.host() + ":" + $location.port();
            esriLoader.bootstrap({
                url: '//js.arcgis.com/4.0beta3'
            }).then(function(loaded){
                require([  domainName+ '/socket.io/socket.io.js' ],function(socketFile) {
                    socket = socketFile.connect();
                    if(url)
                    {

                        socket.emit('activateLink',{
                            link:url
                        });
                    }
                    else
                    {
                        $scope.isValid = false;
                    }

                    socket.on('activatedLink',function(data){
                        $scope.loading = false;
                        if(data.message)
                        {
                            $scope.isValid = false;
                        }
                        //Digest Error
                        if (!$scope.$$phase){
                            $scope.$apply();
                        }
                        $window.location.href = '/';
                    });
                });
            });




        }])
})();