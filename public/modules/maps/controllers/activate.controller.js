(function () {
    'use strict';

    angular.module('esrimaps').controller('ActivateController', ['$scope', '$http', '$location','esriLoader',
        function ($scope, $http, $location,esriLoader) {

            var search = $location.search();
            var url = search.uid;
            var isValid = true;

            var socket ;
            var domainName = $location.protocol() + "://" + $location.host() + ":" + $location.port();
            esriLoader.bootstrap({
                url: '//js.arcgis.com/4.0beta3'
            }).then(function(loaded){
                require([  domainName+ '/socket.io/socket.io.js' ],function(socketFile) {
                    socket = socketFile.connect();
                    console.log(url);
                    if(url)
                    {

                        socket.emit('activateLink',{
                            link:url
                        });

                        socket.on('activatedLink',function(data){
                            if(!data.message)
                            {

                            }
                            else
                            {
                                isValid = false;
                            }
                        });
                    }
                    else
                    {
                        isValid = false;
                    }
                });
            });


        }])
})();