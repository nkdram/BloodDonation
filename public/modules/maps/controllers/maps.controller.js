(function () {
    'use strict';

    angular.module('esrimaps').controller('MapsController', ['$scope', '$http','esriLoader','$uibModal','$log','$location',
        function ($scope,$http,esriLoader , $uibModal, $log,$location) {
             var self = this;

            var socket;
            var domainName = $location.protocol() + "://" + $location.host() + ":" + $location.port();


            var maxExtent = null;
            this.onViewCreated = function (view) {
                console.log('MAP VIEW CREATED');
                self.view = view;
                self.view.watch('extent', function(newValue) {
                    // :-)  When Map becomes stationary -- Load markers !!
                    loadIfExtentChanges(newValue);
                });

                self.view.watch('interacting', function(newValue) {
                    loadIfExtentChanges(self.view.extent);
                });

            };

            var loadIfExtentChanges = function(extent)
            {
                if(self.view.stationary) {
                    $scope.convertVal(extent.xmin,extent.ymin,function(lat,lng)
                    {
                        $scope.convertVal(extent.xmax,extent.ymax,function(latM,lngM)
                        {

                            var extent = {
                                xmin: lat,
                                xmax: latM,
                                ymax: lngM,
                                ymin: lng
                            };

                            if(maxExtent === null
                                || ((extent.xmin < maxExtent.xmin || extent.ymin < maxExtent.ymin) &&
                                (extent.xmax > maxExtent.xmax || extent.ymax > maxExtent.ymax))) {
                                maxExtent = extent;
                                $scope.lazyLoadMarkers(extent);
                            }
                        });
                    });
                }
            };


            $scope.lazyLoadMarkers = function (extent) {
                socket.emit("loadMarkers", extent);

                socket.on("loadedMarkers", function(data){
                    console.log('INSIDE LOADED MARKERS');
                    if(data.markers)
                    {
                        data.markers.forEach(function(marker){
                            var lineAtt = {
                                Name: marker.firstName + ' ' + marker.lastName,  //The name of the pipeline
                                BloodGroup: marker.group,  //The owner of the pipeline
                                Phone: marker.phone
                            };
                            self.loadMarker(marker.lat,
                                marker.lng, null, lineAtt,false);
                        })
                    }
                });
            };

            $scope.$watch('addressComponent', function(newVal,oldVal) {
                if(newVal!=oldVal){
                    var graphics =  self.graphicsLayer.graphics._items;
                    for (var i = 0; i < graphics.length; i++) {
                        if(graphics[i].symbol.source.url == self.currentPT.source.url )
                        {
                            var rtn =  self.graphicsLayer.remove(graphics[i]);
                            if (!$scope.$$phase)
                            {
                                $scope.$apply();
                            }
                            self.loadMarker(newVal.geometry.location.lat, newVal.geometry.location.lng, self.currentPT);
                        }
                    }
                }
            });

            esriLoader.bootstrap({
                url: '//js.arcgis.com/4.0beta3'
            }).then(function(loaded){

                require([  domainName+ '/socket.io/socket.io.js' ],function(socketFile) {
                    socket = socketFile.connect();
                });

                esriLoader.require([
                        'esri/Map',
                        'esri/layers/GraphicsLayer',
                        'esri/Graphic',
                        'esri/geometry/SpatialReference',
                        'esri/geometry/Point',
                        'esri/geometry/geometryEngineAsync',
                        "esri/PopupTemplate",
                        "esri/symbols/PictureMarkerSymbol",
                        "esri/config",
                        "esri/geometry/support/webMercatorUtils"
                    ],
                    function( Map
                              ,GraphicsLayer, Graphic,
                              SpatialReference,  Point,
                              geometryEngineAsync, PopupTemplate,PictureMarkerSymbol,
                              esriConfig,
                              webMercatorUtils) {

                        $scope.convertVal = function(x,y,callBack){
                            var numbers = webMercatorUtils.xyToLngLat(x, y);
                            callBack(numbers[0],numbers[1]);
                        };

                        esriConfig.request.proxyUrl = "/resource-proxy/Java/proxy.jsp";
                        $scope.getCurrentLocation(function(err,position){

                            if(!err) {
                                var lat = position ? position.latitude : 80.20000069999999;
                                var lng = position ? position.longitude : 13.014060599999999;

                                self.map = new Map({
                                    basemap: 'topo',
                                    zoom: 15,
                                    center: [lat,lng]
                                });

                                if (!$scope.$$phase)
                                {
                                    $scope.$apply();
                                }

                                console.log(position.latitude.toFixed(4) + '  ' + position.longitude);

                                self.map.then(function () {
                                    var graphicsLayer = new GraphicsLayer({id:'markerLayer'});
                                    self.map.add(graphicsLayer);
                                    self.graphicsLayer = graphicsLayer;

                                    var pointSym = new PictureMarkerSymbol('/assets/modules/core/img/defaultMarker.png', 40, 40);
                                    self.point = pointSym;
                                    self.sr = new SpatialReference(4326);
                                    var pictureMarkerSymbol = new PictureMarkerSymbol('/assets/modules/core/img/current.png', 50, 50);
                                    self.currentPT = pictureMarkerSymbol;
                                    self.loadMarker(lat, lng, pictureMarkerSymbol);
                                });
                            }
                        });

                        self.loadMarker = function (lat, long, symbol, attribute,animate) {

                            self.latlng = lat + ',' + long;

                            var point = new Point({
                                x: long,
                                y: lat,
                                spatialReference: self.sr
                            });

                            var lineAtt = attribute ? attribute : {
                                Marks : "Your Current Location"
                            };
                            geometryEngineAsync.geodesicBuffer(point, 50, 'yards')
                                .then(function (buffer) {

                                    var id = Math.floor((Math.random() * 99999) + 1);
                                    self.graphicsLayer.add(new Graphic({
                                        geometry: point,
                                        symbol: symbol ? symbol : self.point,
                                        attributes: lineAtt,
                                        popupTemplate: new PopupTemplate({
                                            title: "{Name}",  //The title of the popup will be the name of the pipeline
                                            content: "{*}"  //Displays a table of all the attributes in the popup
                                        })
                                        ,id:id
                                    }));
                                    return buffer;
                                }).then(function (geom) {
                                      if(animate === undefined)
                                     {
                                         self.view.animateTo(point);
                                     }
                                });
                        };

                    });
            });

            //The callback function executed when the location is fetched successfully.
            function onGeoSuccess(location) {
                console.log('SUCCESS');
                console.log(location);
            }
            //The callback function executed when the location could not be fetched.
            function onGeoError(error) {
                console.log('FAILURE');
                console.log(error);
            }

            $scope.getCurrentLocation = function(callBack){
                console.log('Retrieving Position');
                if(!navigator.geolocation)
                {
                    callBack('Error  - Broswer Doesn\'t Support HTML5 Geolocation ',null);
                }
                else if(navigator.geolocation) {

                    var html5Options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
                    geolocator.locate(function(location){
                        if(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
                            location.coords.latitude = parseFloat(location.coords.latitude);
                            location.coords.longitude = parseFloat(location.coords.longitude);
                        }
                        callBack(null, location.coords);
                    }, onGeoError, 2, html5Options, '');
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
                        $scope.addressComponent = $scope.addresses[0];
                    }
                    if($scope.addressComponent)
                    {
                        $scope.mainLocation = $scope.addressComponent.geometry.location;
                    }
                });
            };


        }]);
})();