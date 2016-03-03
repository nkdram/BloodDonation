'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    db = require('../config/sequelize'),
    common = require('./common.controller');

exports.registerDonar = function(donarData,callBack){
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
            }).success(function (updatedData) {
                callBack('Phone number or Email is already registered !',null);
            });
        }
        else {

            var createDonarData = {
                phone: donarData.phone,
                email: donarData.email,
                firstname: donarData.firstName,
                lastname: donarData.lastName,
                address: donarData.address,
                bloodgroup: donarData.bloodgroup,
                latlng: donarData.latlng,
                token:donarData.token,
                active: '0' // Default Zero - during registration
            };

            createDonarData = db.Donars.build(createDonarData);

            createDonarData.save()
                .then(function (createdData) {
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
                }).success(function (updatedData) {
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