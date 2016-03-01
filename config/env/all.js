'use strict';

module.exports = {
    app: {
        title: 'Blood Donat',
        description: 'Connects Donars and Patients',
        keywords: 'Donate Blood'
    },
    port: process.env.PORT || 8079,
    secure: process.env.SECURE || false,
    templateEngine: 'swig',
    sessionSecret: 'Nothing :)',
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/fontawesome/css/font-awesome.css',
                'public/lib/dialogs/dist/dialogs.min.css',
                'public/lib/angular-busy/dist/angular-busy.min.css',
                'public/lib/ng-table/dist/ng-table.css',
                'public/lib/angular-ui-select/dist/select.min.css'
            ],
            js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/dialogs/dist/dialogs.min.js',
                'public/lib/angular-busy/dist/angular-busy.min.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/ng-table/dist/ng-table.js',
                'https://js.arcgis.com/4.0beta3/',
                'public/lib/angular-esri-map/dist/angular-esri-map.js',
                'public/lib/angular-ui-select/dist/select.min.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/app.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    },
    build: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.min.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
                'public/lib/dialogs/dist/dialogs.min.css',
                'public/lib/ng-table/dist/ng-table.css',
                'public/lib/angular-ui-select/dist/select.min.css',
                'public/lib/angular-loading-bar/build/loading-bar.min.css',
                'public/lib/bootstrap-daterangepicker/daterangepicker.css',
                'public/lib/angular-ui-select/dist/select.min.css'
            ],
            js: [
                'public/lib/blob-polyfill/blob.min.js',
                'public/lib/file-saver.js/filesaver.min.js',
                'public/lib/angular/angular.min.js',
                'public/lib/angular-resource/angular-resource.min.js',
                'public/lib/angular-cookies/angular-cookies.min.js',
                'public/lib/angular-animate/angular-animate.min.js',
                'public/lib/angular-touch/angular-touch.min.js',
                'public/lib/angular-sanitize/angular-sanitize.min.js',
                'public/lib/angular-ui-router/release/angular-ui-router.min.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'public/lib/dialogs/dist/dialogs.min.js',
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/ng-table/dist/ng-table.min.js',
                'https://js.arcgis.com/4.0beta3/',
                'public/lib/angular-esri-map/dist/angular-esri-map.js',
                'public/lib/angular-ui-select/dist/select.min.js'
            ]
        },
        css: [
            'public/dist/modules/**/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/**/*.js'
        ]
    }
};