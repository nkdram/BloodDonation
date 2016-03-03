'use strict';

var accountSid = 'AC84ec249b7ee3a71df9071ad29e0d01f6';
var authToken = 'd34d1712ff92c9973b2f0ce64955b77c';
var twilioNumber = "+14244880247";


var  http = require('http')
    , server = http.Server(app)
    , io = require('socket.io').listen(server)
    , client = require('twilio')(accountSid, authToken)
    , speakeasy = require('speakeasy');


io.sockets.on('connection', function(socket) {
    console.log('socket.io connected');
    socket.on('register', function(data) {
        var code = speakeasy.totp({key: 'abc123'});
        /*users.get(data.phone_number, function (geterr, doc, key) {
            if (geterr) {
                createUser(data.phone_number, code, socket);
            }
            else if (checkVerified(socket, doc.verified, data.phone_number) == false) {
                socket.emit('update', {message: "You have already requested a verification code for that number!"});
                socket.emit('code_generated');
            }
        });*/

    });

    socket.on('verify', function(data) {
        var code = Math.floor((Math.random()*999999)+111111);
        /*users.get(data.phone_number, function (geterr, doc, key) {
            if (geterr) {
                socket.emit('reset');
                socket.emit('update', {message: "You have not requested a verification code for " + data.phone_number + " yet!"});
            }
            else if (checkVerified(socket, doc.verified, data.phone_number) == false && doc.code == parseInt(data.code)) {
                socket.emit('verified');
                socket.emit('update', {message: "You have successfully verified " + data.phone_number + "!"});
                users.save(data.phone_number, {code: parseInt(data.code), verified: true}, function (saverr) { if (saverr) { throw saverr; }});
            }
            else {
                socket.emit('update', {message: "Invalid verification code!"});
            }
        });*/

    });
});


function sendSMS(phone_number, code, socket) {
    client.sendSms({
        to: phone_number,
        from: twilioNumber,
        body: 'Your verification code is: ' + code
    }, function(twilioerr, responseData) {

    });
};