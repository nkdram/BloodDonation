'use strict';

/**
 * Module dependencies.
 */
var crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            firstname: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            lastname: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            displayname: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    isEmail: true
                }
            },
            username: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            password: DataTypes.STRING,
            salt: DataTypes.STRING,
            roles: {
                type: DataTypes.ENUM('admin','user'), // Couple of user Roles to login and check Product stats
                defaultValue: 'user'
            },
            updated: {
                type: DataTypes.DATE
            },
            created: {
                type: DataTypes.DATE,
                default: Date.now
            },
            resetPasswordToken: {
                type: DataTypes.STRING
            },
            resetPasswordExpires: {
                type: DataTypes.DATE
            },
            token: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1
            },
            active: {
                type: DataTypes.CHAR,
                defaultValue: '1'
            },
            lastNotesVisited: {
                type: DataTypes.DATE
            }
        }, {
            classMethods: {
                tableName: 'tbl_users'
            },
            instanceMethods: {
                makeSalt: function () {
                    return crypto.randomBytes(16).toString('base64');
                },
                authenticate: function (plainText) {
                    return this.encryptPassword(plainText, this.salt) === this.password;
                },
                encryptPassword: function (password, salt) {
                    if (!password || !salt) return '';
                    salt = new Buffer(salt, 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
                }
            }
        }
    );
    return User;
};
