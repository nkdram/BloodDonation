(function () {
    'use strict';

    var _ = require('lodash'),
        fs = require('fs');

    module.exports = function (grunt) {
        // Unified Watch Object
        var watchFiles = {
            serverViews: ['views/**/*.*'],
            serverJS: ['Gruntfile.js', 'server.js', 'config/**/*.js', 'controllers/**/*.js', '!app/tests/'],
            clientViews: ['public/modules/**/views/**/*.html'],
            clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
            clientCSS: ['public/modules/**/*.css'],
            mochaTests: ['tests/**/*.js']
        };

        // Project Configuration
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            watch: {
                serverViews: {
                    files: watchFiles.serverViews,
                    options: {
                        livereload: true
                    }
                },
                serverJS: {
                    files: watchFiles.serverJS,
                    tasks: ['jshint'],
                    options: {
                        livereload: true
                    }
                },
                clientViews: {
                    files: watchFiles.clientViews,
                    options: {
                        livereload: true
                    }
                },
                clientJS: {
                    files: watchFiles.clientJS,
                    tasks: ['jshint'],
                    options: {
                        livereload: true
                    }
                },
                clientCSS: {
                    files: watchFiles.clientCSS,
                    tasks: ['csslint'],
                    options: {
                        livereload: true
                    }
                },
                mochaTests: {
                    files: watchFiles.mochaTests,
                    tasks: ['test:server']
                }
            },
            jshint: {
                all: {
                    src: watchFiles.clientJS.concat(watchFiles.serverJS),
                    options: {
                        jshintrc: true
                    }
                }
            },
            csslint: {
                options: {
                    csslintrc: '.csslintrc'
                },
                all: {
                    src: watchFiles.clientCSS
                }
            },
            uglify: {
                production: {
                    options: {
                        mangle: true,
                        compress: {
                            drop_console: true
                        },
                        sourceMap: true
                    },
                    files: {
                        'public/dist/application.min.js': 'public/dist/application.js',
                        'public/dist/templates.min.js': 'public/dist/templates.js'
                    }
                },
                test: {
                    options: {
                        mangle: true,
                        compress: {
                            drop_console: true
                        },
                        sourceMap: true
                    },
                    files: {
                        'public/dist/application.min.js': 'public/dist/application.js',
                        'public/dist/templates.min.js': 'public/dist/templates.js'
                    }
                }
            },
            cssmin: {
                combine: {
                    files: {
                        'public/dist/application.min.css': '<%= applicationCSSFiles %>',
                        'public/dist/vendor.min.css': '<%= vendorCSSFiles %>'
                    }
                }
            },
            nodemon: {
                dev: {
                    script: 'server.js',
                    options: {
                        nodeArgs: ['--debug'],
                        ext: 'js html',
                        watch: watchFiles.serverViews.concat(watchFiles.serverJS),
                        ignore: ['.git/**', '.idea/**', 'node_modules/**', 'public/lib/**', 'DBChanges/**', 'uploads/**', 'newrelic_agent.log', 'README.md']
                    }
                }
            },
            'node-inspector': {
                custom: {
                    options: {
                        'web-port': 1337,
                        'web-host': 'localhost',
                        'debug-port': 5858,
                        'save-live-edit': true,
                        'no-preload': true,
                        'stack-trace-limit': 50,
                        'hidden': []
                    }
                }
            },
            ngAnnotate: {
                production: {
                    files: {
                        'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
                    }
                },
                test: {
                    files: {
                        'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
                    }
                }
            },
            concurrent: {
                default: ['nodemon', 'watch'],
                debug: ['nodemon', 'watch', 'node-inspector'],
                options: {
                    logConcurrentOutput: true,
                    limit: 10
                }
            },
            env: {
                test: {
                    NODE_ENV: 'test'
                }
            },
            mochaTest: {
                src: watchFiles.mochaTests,
                options: {
                    reporter: 'spec',
                    require: 'server.js'
                }
            },
            karma: {
                unit: {
                    configFile: 'karma.conf.js'
                }
            },
            concat: {
                production: {
                    options: {
                        stripBanners: true
                    },
                    files: {
                        'public/dist/vendor.min.js': '<%= vendorJavaScriptFiles %>'
                    }
                }
            },
            ngtemplates: {
                options: {
                    htmlmin: {
                        collapseWhitespace: true,
                        removeComments: true
                    },
                    url: function(url) {
                        return url.replace('public', 'assets');
                    },
                    prefix: '/'
                },
                'billing-service': {
                    //src: 'public/modules/**/**.html',
                    src: watchFiles.clientViews,
                    dest: 'public/dist/templates.js'
                }
            }
        });

        // Load NPM tasks
        require('load-grunt-tasks')(grunt);

        // Making grunt default to force in order not to break the project.
        grunt.option('force', true);

        // A Task for loading the configuration object
        grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function () {
            //var init = require('./config/init')();
            var config = require('./config/config');

            grunt.config.set('vendorJavaScriptFiles', config.build.lib.js);
            grunt.config.set('vendorCSSFiles', config.build.lib.css);
            grunt.config.set('applicationJavaScriptFiles', config.assets.js);
            grunt.config.set('applicationCSSFiles', config.assets.css);
        });

        // Default task(s).
        //grunt.registerTask('default', ['lint', 'ngtemplates', 'htmlmin', 'concurrent:default']);
        grunt.registerTask('default', ['lint', 'concurrent:default']);

        // Debug task.
        grunt.registerTask('debug', ['lint', 'concurrent:debug']);

        // Lint task(s).
        grunt.registerTask('lint', ['jshint', 'csslint']);

        // Build task(s).
        grunt.registerTask('build', ['lint', 'loadConfig', 'ngtemplates', 'ngAnnotate', 'uglify', 'cssmin', 'concat']);

        // Test task.
        //grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
        grunt.registerTask('test', ['test:server', 'test:client']);
        grunt.registerTask('test:server', ['env:development', 'mochaTest']);
        grunt.registerTask('test:client', ['env:test', 'karma:unit']);

        // Heroku task.
        grunt.registerTask('heroku', ['test:server', 'test:client']);

    };
})();
