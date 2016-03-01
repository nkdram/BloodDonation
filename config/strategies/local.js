'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    path = require('path'),
    db = require(path.resolve('config/sequelize'));

module.exports = function() {
    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, function(username, password, done) {
            console.log('********************** LOCAL *************************');
            db.User.findOne({
                where: {
                    username: username,
                    active: true
                }, attributes: ['id', 'firstname', 'lastname', 'displayname', 'username', 'password', 'salt', 'roles']
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Authentication failure: Username/Password is invalid.'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Authentication failure: Username/Password is invalid.'
                    });
                }
                done(null, user);
                return null;
            }).catch(function(err){
                return done(err);
            });
        }
    ));
};
