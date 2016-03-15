'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    db = require('../config/sequelize'),
    common = require('./common.controller'),
    request = require('request');

exports.registerDonar = function(donorData,callBack){
    console.log('Inside Data Register');
    db.Donars.findOne({
        where:
            db.sequelize.or(
            { phone: donorData.phone },
            { email: donorData.email })
    }).then(function(Donar){
        if(Donar){
            //Update existing Token
            Donar.updateAttributes({
                token : donorData.token,
                updated: common.getLocalizeCurrentDateTime()
            }).then(function (updatedData) {
                callBack('Phone number or Email is already registered !',Donar);
            });
        }
        else {
            console.log('Inside Creation');
            var createDonorData = {
                phone: donorData.phone,
                email: donorData.email,
                firstname: donorData.firstName,
                lastname: donorData.lastName,
                address: donorData.address,
                bloodgroup: donorData.bloodgroup,
                displayname:donorData.firstName+' '+donorData.lastName,
                latlng: donorData.latlng,
                lat: donorData.lat,
                lng: donorData.lng,
                token: donorData.token,
                active: '0', // Default Zero - during registration,
                link: donorData.link,
                created: common.getLocalizeCurrentDateTime()
            };

            db.Donars.create(createDonorData)
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

exports.updateVerification = function(donorData,code,callBack){
    db.Donars.findOne({
        where:
            db.sequelize.or(
                { phone: donorData.phone },
                { email: donorData.email })
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

exports.updateVerificationByLink = function(donorLink,callBack){
    db.Donars.findOne({
        where:
        {
            link:donorLink
        }
    }).then(function(Donar) {
        if (!Donar) {
            callBack('Link is not valid!', null);
        }
        else{
            Donar.updateAttributes({
                active: '1',
                updated: common.getLocalizeCurrentDateTime(),
                link:''
            }).then(function (updatedData) {
                callBack(null, updatedData);
            });
        }
    });
};

exports.loadMarkers = function(extent,callBack){
    console.log('Inside Load Markers');
    db.Donars.findAll({
        where:
        {
            lat:{ $between : [extent.ymin,extent.ymax] },
            lng:{ $between : [extent.xmin,extent.xmax] }
        }
    }).then(function(Donar){
        var returnData = [];
        if(Donar){
           Donar.forEach(function(item){
               returnData.push({
                   firstName:item.firstname,
                   lastName:item.lastname,
                   lat:item.lat,
                   lng:item.lng,
                   phone:item.phone,
                   group:item.bloodgroup
               });
           });
        }
        callBack(null,returnData);
    })
};

exports.updateInfo = function(donorData,link,callBack){
    db.Donars.findOne({
        where:
            db.sequelize.or(
                { phone: donorData.phone },
                { email: donorData.email })
    }).then(function(Donar) {
        if (!Donar) {
            callBack('Phone number or Email is not registered yet!', null);
        }
        else {
            if (Donar.link === link) {
                Donar.updateAttributes(donorData).then(function (updatedData) {
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