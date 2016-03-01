'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    db = require('../config/sequelize'),
    common = require('./common.controller'),
    passport = require('passport');

/**
 * Signup
 */
exports.signup = function (req, res) {
    // For security measurement we remove the roles from the req.body object
    //delete req.body.roles;

    if (req.body && req.body.password) {
        var originalPassword = req.body.password;
        var complexity = require('complexity');
        //Configuring the password complexity
        var options = {
            special: 1,  // ! @ # $ & *
            digit: 1,  // 0 through 9
            alphaNumeric: 1,  // a through Z
            min: 8  // minumum number of characters
        };
        var passwordComplexity = complexity.checkError(originalPassword, options); //get the password strength status
        if (complexity.check(originalPassword, options)) {   // Check the password strength
            //console.log(passwordComplexity);

            // Init Variables
            var user = db.User.build(req.body);
            //var message = null;

            // Add missing user fields
            user.provider = 'local';
            user.displayName = user.firstname + ' ' + user.lastname;
            user.salt = user.makeSalt();
            user.password = user.encryptPassword(req.body.password, user.salt);
            user.created = common.getLocalizeCurrentDateTime();
            //user.roles = user.roles;
            user.createdAt = undefined;
            user.updatedAt = undefined;

            // Then save the user
            user.save()
                .then(function (user) {
                    res.json(user);
                }).catch(function (err) {
                    //console.log(err);
                    return res.status(400).send({
                        message: common.getErrorMessage(err)
                    });
                });
        } else {
            console.log('Password length should be min 8 characters, and password should contain alphaNumeric and atleast one special character (! @ # $ & *)', passwordComplexity);
        }
    }
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            console.log(req._startTime + ', username: ' + req.body.username + ', from: ' + req.headers.origin +', browser: '+ req.headers['user-agent']);
            if (err) {
                console.log('Error:', err);
            } else {
                console.log(user);
            }
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    console.log('Error: user while login', err);
                    res.status(400).send(err);
                } else {
                    res.jsonp(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};
