(function () {
    'use strict';

    angular.module('dashboard').controller('DashboardController', ['$scope', 'Authentication','$http',
        function ($scope, Authentication,$http) {
            $scope.authentication = Authentication;
            $scope.processed = true;

            $scope.getCategorizedProducts = function(){

                $http.get('/list').success(function (data, status, headers, config) {
                    if(status != 200){
                        $scope.processed = false;
                    }
                    else
                    {
                        $scope.highest = data.highestPercent;
                        $scope.lowest = data.lowestPercent;
                        $scope.tableData = data.data;

                        data.data.forEach(function(category){
                            category.catArr.forEach( function(category){
                                var
                                    red = new Color(232, 9, 26),
                                    white = new Color(255, 255, 255),
                                    green = new Color(6, 170, 60),
                                    start = green,
                                    end = white;

                                //var percent = category.percent < 0 ? Math.abs(category.percent)/$scope.highest :
                                var percent = category.percent < 0 ?
                                      (50 + (((100 - 51) / 100) * Math.abs(category.percent))) : (1 + (((50 - 1) / 50) * Math.abs(category.percent)));
                                if (percent > 50) {
                                    start = white,
                                        end = red;
                                    percent = percent % 51;
                                }
                                if(category.percent == 0) {
                                    percent = 50;

                                    category.style = "#FFFFFF";
                                }

                                else
                                {

                                   // rgbToHex()
                                    var startColors = start.getColors(),
                                        endColors = end.getColors();
                                    var r = Interpolate(startColors.r, endColors.r, 50, percent);
                                    var g = Interpolate(startColors.g, endColors.g, 50, percent);
                                    var b = Interpolate(startColors.b, endColors.b, 50, percent);
                                    category.style = rgbToHex(r,g,b);
                                          //"rgb(" + r + "," + g + "," + b + ")";
                                }

                            });
                        });



                    }
                });

            };

            function rgbToHex(r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            }
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }


            function Interpolate(start, end, steps, count) {
                var s = start,
                    e = end,
                    final = s + (((e - s) / steps) * count);
                return Math.floor(final);
            }

            function Color(_r, _g, _b) {
                var r, g, b;
                var setColors = function(_r, _g, _b) {
                    r = _r;
                    g = _g;
                    b = _b;
                };

                setColors(_r, _g, _b);
                this.getColors = function() {
                    var colors = {
                        r: r,
                        g: g,
                        b: b
                    };
                    return colors;
                };
            }



        }
    ]);
})();

