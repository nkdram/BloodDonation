'use strict';

var passport  = require('passport');

module.exports = function(app) {
    var core = require('../controllers/core.controller');

    app.use(function (req, res, next) {
        if (req.query.access_token) {
            passport.authenticate('bearer', function (err, user) {
                if (err || !user) {
                    console.log(req._startTime + ', token: ' + req.query.access_token + ', from: ' + req.headers.host + ', browser: ' + req.headers['user-agent']);
                    return res.send(401, {
                        message: 'User not authenticated. Please check API token or contact administrator.'
                    });
                }
                req.login(user, function (err) {
                    if (err) {
                        return res.send(401, {
                            message: 'User not authenticated using token.'
                        });
                    }
                    //db.Loginacitivity( req, res, user );
                    next();
                });
            })(req, res, next);
        } else {
            next();
        }
    });

    app.route('/').get(core.index);
};