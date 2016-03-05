(function () {
    'use strict';

    angular.module('esrimaps').controller('MapsController', ['$scope', '$http','esriLoader','$uibModal','$log',
        function ($scope,$http,esriLoader , $uibModal, $log) {
             var self = this;
             esriLoader.require([
                 'esri/Map',
                     'esri/layers/GraphicsLayer',
                     'esri/Graphic',
                     'esri/geometry/SpatialReference',
                     'esri/geometry/geometryEngine',
                     'esri/geometry/Point',

                     'esri/symbols/SimpleMarkerSymbol',
                     'esri/symbols/SimpleLineSymbol',
                     'esri/symbols/SimpleFillSymbol',
                     'esri/geometry/geometryEngineAsync',
                     "esri/PopupTemplate",
                     "esri/symbols/PictureMarkerSymbol"
             ],
                 function( Map, GraphicsLayer, Graphic,
                           SpatialReference, geometryEngine, Point,
                           SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
                           geometryEngineAsync, PopupTemplate,PictureMarkerSymbol) {

                 $scope.getCurrentLocation(function(err,position){

                     if(!err) {
                         console.log(position);
                         var lat = position ? position.latitude : 80.20000069999999;
                         var lng = position ? position.longitude : 13.014060599999999;

                         console.log(position.latitude.toFixed(4) + '  ' + position.longitude);
                         self.latlng = position.latitude.toFixed(4) + ',' + position.longitude.toFixed(4);
                         self.map = new Map({
                             basemap: 'streets',
                             zoom: 15
                         });

                         //Initial Load
                         if (!$scope.$$phase) {
                             $scope.$apply();
                         }
                         self.onViewCreated = function (view) {
                             self.view = view;
                         };
                         var graphicsLayer = new GraphicsLayer();
                         self.map.then(function () {
                             self.map.add(graphicsLayer);
                             self.graphicsLayer = graphicsLayer;

                             var pointSym = new PictureMarkerSymbol('/assets/modules/core/img/defaultMarker.png', 40, 40);
                             self.point = pointSym;
                             self.sr = new SpatialReference(4326);

                             var pictureMarkerSymbol = new PictureMarkerSymbol('/assets/modules/core/img/current.png', 50, 50);

                             self.loadMarker(lat, lng, pictureMarkerSymbol);

                         });

                         self.loadMarker = function (lat, long, symbol, attribute) {


                             var point = new Point({
                                 x: long,
                                 y: lat,
                                 spatialReference: self.sr
                             });

                             var lineAtt = attribute ? attribute : {
                                 Name: "Your Current Location"
                             };


                             geometryEngineAsync.geodesicBuffer(point, 50, 'yards')
                                 .then(function (buffer) {

                                     self.graphicsLayer.add(new Graphic({
                                         geometry: point,
                                         symbol: symbol ? symbol : self.point,
                                         attributes: lineAtt,
                                         popupTemplate: new PopupTemplate({
                                             title: "{Name}",  //The title of the popup will be the name of the pipeline
                                             content: "{*}"  //Displays a table of all the attributes in the popup
                                         })
                                     }));
                                     return buffer;
                                 }).then(function (geom) {

                                 // Zoom to newly added point
                                 return self.view.then(function () {
                                     // animate to the buffer geometry
                                     return self.view.animateTo(geom).then(function () {
                                         // when the animation completes, set the scale to 1:24,000
                                         self.view.scale = 24000;
                                         // resolve the promises with the input geometry
                                         return geom;
                                     });
                                 });
                             });
                         };
                     }
                 });
             });

            $scope.getCurrentLocation = function(callBack){
                if(!navigator.geolocation)
                {
                    callBack('Error  - Broswer Doesn\'t Support HTML5 Geolocation ',null);
                }
                else if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log('Retrieved position using HTML5 Geolocations');
                        callBack(null,position.coords);
                    },function(err){
                        $http({
                            method: 'GET'
                            ,url:'//freegeoip.net/json/'
                        }).then(function(location) {
                            console.log('Retrieved position using Geoip');
                            location = location.data;
                            var position ={ coords : {
                                latitude: location.latitude ,longitude: location.longitude
                            } };
                            callBack(null,position.coords);
                        });

                        /*$.ajax( {
                            url: '//freegeoip.net/json/',
                            type: 'POST',
                            dataType: 'jsonp',
                            success: function(location) {

                                var position ={ coords : {
                                    latitude: location.latitude ,longitude: location.longitude
                                } };

                                console.log('Retrieved position using Geoip');
                                callBack(null,position.coords);
                            }
                        } );*/
                    });
                }
            };



            /*
             * Modal Section
             */

            $scope.animationsEnabled = true;

            $scope.open = function (size) {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/assets/modules/maps/views/addLocation.html',
                    controller:'AddLocationController',
                    size: size,
                    resolve: {
                        items: function () {
                            return self; //Return Map to child controller
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };



        }]);
})();