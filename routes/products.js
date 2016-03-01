'use strict';

module.exports = function(app) {
    var products = require('../controllers/product.controller');
    console.log('Inside ROUTES');

    // Getting Products
    app.route('/list').get(products.list);

    app.route('/fileupload').post(products.upload);
    app.route('/fileuploadstatus').get(products.uploadstatus);
};