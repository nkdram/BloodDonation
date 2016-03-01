'use strict';

// /////////////////////////////////////////////////////
// INTRO console.log message ( Welcome to Product Stats! )
// /////////////////////////////////////////////////////
console.log(
    '%cWelcome to %cIndix %cProduct Stats'
    ,'color:#879aa5; font:normal 1.3em/1.2em arial'
    ,'color:#0070AF; font:normal 1.6em/1.1em arial'
    ,'color:#009B94; font:normal 1.4em/1.3em arial'
);

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'billing-service';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'dialogs.main',
        'ngTable',
        'esri.map',
        'ui.select'
    ];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    var applicationPageSize = 15;

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule,
        applicationPageSize: applicationPageSize
    };
})();

(function (window, angular, undefined) {
    'use strict';
    var agl = angular || {};
    var ua = navigator.userAgent;

    agl.ISFF = ua.indexOf('Firefox') != -1;
    agl.ISOPERA = ua.indexOf('Opera') != -1;
    agl.ISCHROME = ua.indexOf('Chrome') != -1;
    agl.ISSAFARI = ua.indexOf('Safari') != -1 && !agl.ISCHROME;
    agl.ISWEBKIT = ua.indexOf('WebKit') != -1;

    agl.ISIE = ua.indexOf('Trident') > 0 || navigator.userAgent.indexOf('MSIE') > 0;
    agl.ISIE6 = ua.indexOf('MSIE 6') > 0;
    agl.ISIE7 = ua.indexOf('MSIE 7') > 0;
    agl.ISIE8 = ua.indexOf('MSIE 8') > 0;
    agl.ISIE9 = ua.indexOf('MSIE 9') > 0;
    agl.ISIE10 = ua.indexOf('MSIE 10') > 0;
    agl.ISOLD = agl.ISIE6 || agl.ISIE7 || agl.ISIE8 || agl.ISIE9; // MUST be here

    agl.ISIE11UP = ua.indexOf('MSIE') == -1 && ua.indexOf('Trident') > 0;
    agl.ISIE10UP = agl.ISIE10 || agl.ISIE11UP;
    agl.ISIE9UP = agl.ISIE9 || agl.ISIE10UP;

})(window, window.angular);