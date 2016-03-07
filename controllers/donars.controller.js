'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    db = require('../config/sequelize'),
    common = require('./common.controller'),
    request = require('request');

exports.registerDonar = function(donarData,callBack){
    console.log('Inside Data Register');
    db.Donars.findOne({
        where:
            db.sequelize.or(
            { phone: donarData.phone },
            { email: donarData.email })
    }).then(function(Donar){
        if(Donar){
            //Update existing Token
            Donar.updateAttributes({
                token : donarData.token,
                updated: common.getLocalizeCurrentDateTime()
            }).then(function (updatedData) {
                callBack('Phone number or Email is already registered !',Donar);
            });
        }
        else {
            console.log('Inside Creation');
            var createDonarData = {
                phone: donarData.phone,
                email: donarData.email,
                firstname: donarData.firstName,
                lastname: donarData.lastName,
                address: donarData.address,
                bloodgroup: donarData.bloodgroup,
                displayname:donarData.firstName+' '+donarData.lastName,
                latlng: donarData.latlng,
                lat: donarData.lat,
                lng: donarData.lng,
                token: donarData.token,
                active: '0', // Default Zero - during registration,
                link: donarData.link,
                created: common.getLocalizeCurrentDateTime()
            };

            db.Donars.create(createDonarData)
                .then(function (createdData) {
                    console.log('Created');
                    callBack(null,createdData);
                }).catch(function (err) {
                //console.log(err);
                callBack('Error while Creating Donar');
            });
        }
    })
};

exports.updateVerification = function(donarData,code,callBack){
    db.Donars.findOne({
        where:
            db.sequelize.or(
                { phone: donarData.phone },
                { email: donarData.email })
    }).then(function(Donar) {
        if (!Donar) {
            callBack('Phone number or Email is not registered yet!', null);
        }
        else{
            if(Donar.token === code) {
                Donar.updateAttributes({
                    active: '1',
                    updated: common.getLocalizeCurrentDateTime()
                }).then(function (updatedData) {
                    callBack(null, updatedData);
                });
            }
            else
            {
                callBack('Token Doesn\'t Match !', null);
            }
        }
    });
};

exports.updateInfo = function(donarData,link,callBack){
    db.Donars.findOne({
        where:
            db.sequelize.or(
                { phone: donarData.phone },
                { email: donarData.email })
    }).then(function(Donar) {
        if (!Donar) {
            callBack('Phone number or Email is not registered yet!', null);
        }
        else {
            if (Donar.link === link) {
                Donar.updateAttributes(donarData).then(function (updatedData) {
                    callBack(null, updatedData);
                });
            }
            else {
                callBack('Unique Link Doesn\'t Match !', null);
            }
        }
    });
};

exports.proxy = function(req,res){
    console.log(req.originalUrl);
    var newurl = req.originalUrl.split("?")[1];
    request(newurl).pipe(res);
};