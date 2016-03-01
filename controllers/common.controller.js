'use strict';


/*
* Controller for common functions
 */
var moment = require('moment-timezone');


exports.endsWith = function(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

exports.getLocalizeCurrentDateTime = function () {
    return moment().utc().tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function (err) {
    var output;

    try {
        var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exist';

    } catch (ex) {
        output = 'Unique field already exist';
    }

    return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
    var message = '';

    if (err.sql) {
        message = 'CODE: ' + err.code + ' - SQL: ' + err.sql;
    } else if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            case 12000:
                message = 'Plan not found';
                break;
            case 'card_declined':
            case 'incorrect_number':
            case 'invalid_number':
            case 'expired_card':
            case 'incorrect_cvc':
            case 'incorrect_zip':
            case 'missing':
            case 'processing_error':
            case 'rate_limit':
            case 'invalid_expiry_month':
            case 'invalid_expiry_year':
            case 'invalid_cvc':
                message = err.message;
                break;
            default:
                message = 'Something went wrong';
        }
        //Stripe error
    } else if (err.message) {
        message = err.message;
    } else if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    } else {
        console.log(typeof err);
        if (typeof err === 'string') {
            message = err;
        }
        else {
            var keys = Object.keys(err);
            for (var i = 0, length = keys.length; i < length; i++) {
                message = err[keys[i]][0];
            }
        }
    }

    return message;
};