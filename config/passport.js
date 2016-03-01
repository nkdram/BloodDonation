'use strict';

var passport = require('passport'),
    db = require('./sequelize'),
    path = require('path'),
    config = require('./config');

module.exports = function () {
    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log('********************** PASSPORT *************************');
        db.User.find({
            where: {
                id: id,
                active: true
            }, attributes: ['id', 'firstname', 'lastname', 'displayname', 'email', 'username', 'roles', 'active']
        }).then(function (user) {
            if(!user){
                done(null, false);
            }
            done(null, user);
            return null;
        }).catch(function (err) {
            done(err, null);
        });
    });

    // Initialize strategies
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
        require(path.resolve(strategy))();
    });
};
