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
            displayname: {type:DataTypes.STRING},
            bloodgroup: {type:DataTypes.STRING},
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                    isEmail: true
                }
            },
            phone: {
                type: DataTypes.STRING,
                validate: {
                notEmpty: true
                }
            },
            address: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            latlng: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            lat: {
                type: DataTypes.DECIMAL,
                validate: {
                    notEmpty: true
                }
            },
            lng: {
                type: DataTypes.DECIMAL,
                validate: {
                    notEmpty: true
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
                defaultValue: '0'
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
