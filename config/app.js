
/**
 * Module dependencies
 */
var express = require('express');
var favicon = require('serve-favicon'),
     logger = require('morgan'),
     methodOverride = require('method-override'),
     consolidate = require('consolidate'),
     session = require('express-session'),
     bodyParser = require('body-parser'),
     multer = require('multer'),
     compress = require('compression'),
     errorHandler = require('errorhandler'),
	 path = require('path'),
     passport = require('passport'),
     config = require('./config');

module.exports =function(){

    var app = module.exports = express();


    /**
     * Configuration
     */

// all environments
    app.set('port', process.env.PORT || 8079);

     app.locals.title = 'Indix Challenge';

    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Should be placed before express.static
    app.use(compress({
        // only compress files for the following content types
        filter: function(req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        // zlib option for compression level
        level: 9
    }));

    app.set('showStackError', true);


    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './views');

    app.use(logger('dev'));
    app.use(methodOverride());
    app.use(session({ resave: true, saveUninitialized: true,
        secret: 'uwotm8' }));
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());


    //app.locals.secure = config.secure;

    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse multipart/form-data
    app.use(multer({ dest: './uploads/' }))

    /*app.post('/fileupload', upload.single('product'), function (req, res, next) {
        next();
    });*/

    app.use('/assets', express.static(path.resolve('./public')));

    // Enable jsonp
    app.enable('jsonp callback');

    /*var sessionOptions = {
     name :'Ws3Bs-aMeEx',
     rolling : true,
     saveUninitialized: false,
     resave: false,
     secret: config.sessionSecret,
     cookie: {
     path: '/',
     httpOnly: true,
     maxAge : config.sessionExpiration
     },
     key: config.sessionKey,
     store: new RedisStore( redisOpts ),
     proxy: true,
     unset : 'destroy'
     };


     app.use(session(sessionOptions));*/


    var env = process.env.NODE_ENV || 'development';

// development only
    if (env === 'development') {
        //app.use(express.errorHandler());
    }

// production only
    if (env === 'production') {
        // TODO
    }


    /**
     * Routes
     */

    config.getGlobbedFiles('../policies/**/*.js').forEach(function(policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });

// Globbing routing files
    config.getGlobbedFiles(['./routes/products.js','./routes/core.js','./routes/user.js']).forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });
// serve index and view partials


// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

// Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    /**
     * Start Server
     */
    /*app.listen(app.get('port'), function(){
        console.log('Express server on port ' + app.get('port'));
    });*/
    return app;
};

