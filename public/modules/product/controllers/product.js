

(function () {
    'use strict';

    angular.module('product').controller('ProductController', ['$scope', 'Authentication','TimerService','$interval','$http',
        function ($scope, Authentication,TimerService,$interval,$http) {
            $scope.authentication = Authentication;

            $scope.progressstatus = {
                maxcount: 1,
                currentloop: 0,
                percent: 0
            };

            var pageLoader = document.getElementById('pageLoader');
            $scope.exceluploads = function () {
                $scope.error = '';
                $scope.logeachCustomeruploaddata = null;
                var form = document.getElementById('formupload');
                var formData = new FormData(form);
                formData.append('userid', $scope.authentication.user.id);
                pageLoader.setAttribute('style', 'display:block');
                $scope.insertStarted = false;
                $http.post('/fileupload', formData,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }
                ).success(function (data, status, headers, config) {

                        if (status === 200 && data !== null && data !== '') {
                           // data = {customerData: data, userid: $scope.authentication.user.id};
                            $scope.progressstatus.maxcount =  data.total;
                            $scope.insertStarted = true;
                        } else {
                            $scope.error = 'The uploaded Data is not valid.';
                            pageLoader.setAttribute('style', 'display:none');
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.error = data.message;
                        pageLoader.setAttribute('style', 'display:none');
                    });

                // Call after 20 secs to file insertion status
                $interval(function () {
                        $scope.customerDataPost();
                    }
                    ,10000)
            };


          $scope.customerDataPost =   function() {

              /*// Reset insertStarted to false
                $scope.insertStarted = false;*/
                $interval(function () {
                    if ($scope.progressstatus.maxcount !== $scope.progressstatus.currentloop) {
                        $scope.reloadData('/fileuploadstatus');
                    }
                    else
                    {
                        pageLoader.setAttribute('style', 'display:none');
                    }
                }, 5000);

            };

            $scope.getpercent  =   function (currentRow, maxRow) {
                return Math.round((currentRow * 100) / maxRow);
            };

            $scope.reloadData  =  function (urlep) {
                // a call to the async method
                TimerService.recentClients(urlep).then(function (response) {

                    //$scope.progressstatus.maxcount = parseInt( response.data.total);

                    var completedCount = response.data.data.completed ? parseInt(response.data.data.completed):0;

                    console.log('INSIDE TIMER RESPONSE ', completedCount, $scope.insertStarted);

                    if(completedCount > 0 && $scope.insertStarted) {

                        console.log('INSIDE COMPLETED ', completedCount);

                        $scope.progressstatus.currentloop = completedCount;
                        $scope.progressstatus.percent = $scope.getpercent($scope.progressstatus.currentloop, $scope.progressstatus.maxcount);

                        if (!$scope.$$phase) {$scope.$apply();}
                    }
                });
            }

        }
    ]);
})();
