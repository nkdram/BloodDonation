'use strict';





exports.index = function(req, res) {

    console.log('INSIDE INDEX REQUEST');
    res.render('index', {
        user: req.user || null
    });
};