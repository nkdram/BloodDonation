'use strict';

/**
 * Module dependencies.
 */
var Converter = require("csvtojson").Converter,
    async = require('async'),
    bsutils = require('./common.controller'),
    _ = require('lodash'),
    db = require('../config/sequelize');

var fs = require('fs');

var objectArrayData = {};

exports.list = function(req, res) {
    var returnJson = [];
    var storeToCompare = 'My Store';
    db.sequelize.query("select min(stores) as allstores from vw_groupedProductsByCategory",
        { type: db.sequelize.QueryTypes.SELECT})
        .then(function(allStores) {
            if(allStores && allStores.length > 0) {
                console.log(allStores[0].allstores);
                var allStores = allStores[0].allstores.split(',');
                var highestPercent = 0, lowestPercent = 0;

                db.sequelize.query("SELECT category, averageprice, stores FROM vw_groupedProductsByCategory",
                    { type: db.sequelize.QueryTypes.SELECT})
                    .then(function (categorizedProducts) {
                    if (categorizedProducts && categorizedProducts.length > 0) {
                        categorizedProducts.forEach(function (item) {
                            var category = item.category;
                            var stores = item.stores.split(',');
                            var prices = item.averageprice.split(',');

                            var catArr = [];
                            var mystorePrice = parseFloat(prices[stores.indexOf(storeToCompare)]).toFixed(2);

                            //Gather data based on stores
                            allStores.forEach(function(eachStore){
                                var index = stores.indexOf(eachStore);
                                var eachData = {};
                                if(index > -1 )
                                {
                                    console.log('FInding store price : ' + eachStore);
                                    eachData.price = parseFloat(prices[index]).toFixed(2);
                                    eachData.store = eachStore;
                                    eachData.category = category;
                                    eachData.difference = eachData.price - mystorePrice;
                                    eachData.percent = (eachData.difference/mystorePrice) * 100;
                                    eachData.available = true;
                                }else{

                                    eachData.price = 0;
                                    eachData.store = eachStore;
                                    eachData.category = category;
                                    eachData.difference = 0;
                                    eachData.percent = 0;
                                    eachData.available = false;
                                }

                                if( eachData.percent < 0 && eachData.percent < lowestPercent )
                                {
                                    lowestPercent = eachData.percent;
                                }

                                if( eachData.percent > 0 && eachData.percent > lowestPercent )
                                {
                                    highestPercent = eachData.percent;
                                }
                                console.log(eachData);
                                catArr.push(eachData);
                            });

                            returnJson.push({
                                category:category,
                                catArr: catArr
                            })

                        });

                        res.status(200).send({
                            message: 'Data Processed !!',
                            data: returnJson,
                            highestPercent: highestPercent,
                            lowestPercent: lowestPercent
                        });

                    }
                    else {
                        res.status(400).send({
                            message: 'Data is not ingested yet !!'
                        });

                    }

                });
            }
            else {
                res.status(400).send({
                    message: 'Data is not ingested yet !!'
                });
                return;
            }
        });


};

var total = 0,completed = 0;

exports.uploadstatus = function (req, res){

    db.Product.count({ where: { id: { $ne: 0 } } }).then(function(count){
        res.status(200).send({
            data: {
                completed: count
            }
        });
    });


};

exports.upload = function (req, res){
    var uploafile = req.files;
    console.info(req.files);
    if(!uploafile.myFile){
        return res.status(400).send({
            message: 'Please upload a excel SpreadSheet Data with extenstion of [*.csv] '
        });
    }

    if (!bsutils.endsWith(uploafile.myFile.originalname, '.csv')) {
        res.status(400).send({
            message: 'Not a valid file, Please upload only [*.csv] files to continue.'
        });
        return;
    }

    var converter = new Converter({});



    converter.fromFile('./uploads/'+ uploafile.myFile.name,function(err,results){

        console.log(results);
        if(err) {
            console.log('Error:', err);
        }
        else
        {
            console.log("GETTING LENGTH OF UPLOADED CSV");
            console.log(results.length);

            if(results.length > 0)
            {
                total = results.length;
                db.Product.destroy({
                    where: {
                        id: {
                            $ne: 0
                        }
                    }
                }).then(function(afterDelete){
                    async.eachLimit(results,1000,function(item, callback){

                            //console.log("GETTING DETAILS OF :" + item.Title);
                            db.Product.create({
                                //id: item.ID,
                                prodid: item.ID,
                                title: item.Title,
                                store: item.Store,
                                price: item.Price,
                                toplevelcategory: item['Top Level Category'],
                                subcategory: item['Sub Category']
                            }).then(function (createdItems) {
                                completed+=1000;
                                callback();
                            });

                        },
                        function(err) {
                            console.log('limit done');
                            fs.unlinkSync('./uploads/'+ uploafile.myFile.name);

                        });
                    res.status(200).send({
                        message: 'upload done',
                        total: total
                    });
                });
            }
            else
            {
                res.status(200).send({
                    message: 'upload done',
                    total: 0
                });
            }
        }


    });

};