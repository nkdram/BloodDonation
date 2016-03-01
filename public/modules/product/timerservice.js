'use strict';

//Customers service used to communicate Customers REST endpoints

angular.module('product').factory('TimerService', ['$http', '$rootScope', function ($http, $rootScope) {

    var recentClients = function(apiURL) {
        return $http.get(apiURL);
    };

    return {
        recentClients : recentClients
    };
}]);