/*var Sequelize = require('sequelize');
//var pg = require('pg').native; //again this line is specific to using a Postgres database
var config = require('../config/dbconfig');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    native: config.native
});

return sequelize;*/


'use strict';

var fs        = require('fs'),
    path      = require('path'),
    Sequelize = require('sequelize'),
    _         = require('lodash'),
    config = require('../config/dbconfig'),
    common    = require('../config/config'),
    db        = {};

// create your instance of sequelize
/*var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    protocol: 'postgres',
    dialect: config.dialect,
    port: config.port,
    native: config.native,
    logging: false,
    dialectOptions: {
        ssl: true
    },
    // Specify options, which are used when sequelize.define is called.
    // The following example:
    //   define: {timestamps: false}
    // is basically the same as:
    //   sequelize.define(name, attributes, { timestamps: false })
    // so defining the timestamps for each model will be not necessary
    // Below you can see the possible keys for settings. All of them are explained on this page
    define: {
        underscored: false,
        freezeTableName: false,
        syncOnAssociation: false,
        timestamps: false
    }
});*/


var match = config.postgresurl
    .match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
var sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    native: config.native,
    logging: true,
    dialectOptions: {
        ssl: true
    },
    define: {
        underscored: false,
        freezeTableName: false,
        syncOnAssociation: false,
        timestamps: false
    }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Database connected.');
    })
    .catch(function (err) {
        console.error('Error: Unable to connect to the database.'+ err);
    })
    .done();

common.getGlobbedFiles('./models/**/*.js').forEach(function(modelPath) {
    var model = sequelize.import(path.resolve(modelPath));
    db[model.name] = model;
});

// invoke associations on each of the models
Object.keys(db).forEach(function(modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db);
    }
});



/*
 * User Logs activity
 */
var Loginacitivity = function (req, res, user) {
    if (user) {
        sequelize.query('INSERT INTO tbl_user_activity (UserID) values (' + user.id + ')', null, {
            logging: console.log,
            raw: false
        }).then(function (result) {
            console.log(result);
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    }
};

/*
 * Assign the sequelize variables to the db object and returning the db.
 */
module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize,
    Loginacitivity: Loginacitivity
}, db);
