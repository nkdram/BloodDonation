(function () {
    'use strict';

    angular.module('esrimaps').controller('MapsController', ['$scope', 'Authentication','$http','esriLoader','$uibModal','$log',
        function ($scope, Authentication,$http,esriLoader , $uibModal, $log) {
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



                     if (navigator.geolocation) {
                         navigator.geolocation.getCurrentPosition(function(position){

                             var lat = position.coords ? position.coords.latitude : 80.20000069999999;
                             var lng = position.coords ? position.coords.longitude: 13.014060599999999;

                             console.log(position.coords.latitude.toFixed(4)+'  '+position.coords.longitude);
                             self.latlng = position.coords.latitude.toFixed(4)+','+position.coords.longitude.toFixed(4);
                             self.map = new Map({
                                 basemap: 'streets',
                                 zoom: 15
                             });


                             self.onViewCreated = function(view) {
                                 self.view = view;
                             };
                             var graphicsLayer = new GraphicsLayer();
                             self.map.then( function(){
                                 self.map.add( graphicsLayer);
                                 self.graphicsLayer = graphicsLayer;

                                 var pointSym = new PictureMarkerSymbol('/assets/modules/core/img/defaultMarker.png', 25, 25);
                                 self.point = pointSym;
                                 self.sr = new SpatialReference(4326);

                                 var pictureMarkerSymbol = new PictureMarkerSymbol('/assets/modules/core/img/current.png', 25, 25);

                                 self.loadMarker(lat,lng,pictureMarkerSymbol);
                             });

                             self.loadMarker = function(lat,long,symbol,attribute){


                                 var point = new Point({
                                     x: long,
                                     y: lat,
                                     spatialReference: self.sr
                                 });

                                 var lineAtt = attribute ? attribute : {
                                     Name: "Your Current Location"
                                 };



                                 geometryEngineAsync.geodesicBuffer(point, 50, 'yards')
                                     .then(function(buffer){

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
                                     }).then(function(geom){

                                     // Zoom to newly added point
                                     return self.view.then(function() {
                                         // animate to the buffer geometry
                                         return self.view.animateTo(geom).then(function() {
                                             // when the animation completes, set the scale to 1:24,000
                                             self.view.scale = 24000;
                                             // resolve the promises with the input geometry
                                             return geom;
                                         });
                                     });
                                 });


                                 /*var gra = new Graphic(myPoint);
                                  self.graphicsLayer.add(gra);*/
                             };

                         }, function(msg){
                             console.log('not supported: '+ msg);
                         });
                     } else {
                         console.log('not supported');
                     }




             });

            $scope.getCurrentLocation = function(){
                if(!navigator.geolocation)
                {
                    return null;
                }
                else if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        return position.coords;
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