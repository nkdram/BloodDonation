'use strict';

/**
 * Module dependencies.
 */

module.exports = function (sequelize, DataTypes) {
    var Donars = sequelize.define('Donars', {
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
            updated: {
                type: DataTypes.DATE
            },
            created: {
                type: DataTypes.DATE,
                default: Date.now
            },
            token: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.STRING
            },
            active: {
                type: DataTypes.CHAR,
                defaultValue: '1'
            },
            link:{
                type: DataTypes.STRING,
                defaultValue: DataTypes.STRING
            }
        }, {
            classMethods: {
                tableName: 'tbl_donars'
            }
        }
    );
    return Donars;
};
