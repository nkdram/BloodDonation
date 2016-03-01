'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    path = require('path'),
    db = require(path.resolve('config/sequelize'));

var findByToken = function(token, fn) {
    console.log('^ ^  ^  ^  ^ B.E.A.R.E.R  ^ ^  ^  ^  ^');
    db.User.findOne({
        where: {
            token: token,
            active: true
        },
        //attributes: ['id', 'firstName', 'lastName', 'displayName', 'username', 'password', 'salt', 'roles']
        attributes: ['id', 'username', 'roles']
    }).then(function(user) {
        if (!user) {
            return fn(null, null);
        } else {
            console.log('Login (local) : { id: ' + user.id + ', username: ' + user.username + ' }');
            fn(null, user);
            return null;
        }
    }).catch(function(err){
        return fn(err);
    });
};

module.exports = function() {
    // Use Bearer strategy
    passport.use(new BearerStrategy( function(token, done) {
            process.nextTick(function () {
                findByToken(token, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    done(null, user);
                    return null;
                });
            });
        }
    ));
};
