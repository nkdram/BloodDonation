'use strict';





exports.index = function(req, res) {

    console.log('INSIDE Blood Donation REQUEST');
    res.render('index', {
        user: req.user || null
    });
};