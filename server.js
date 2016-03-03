



var app = require('./config/app')();

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
//app.listen(app.get('port'));
var http = require('http');

var httpServer = http.Server(app);
httpServer.listen(app.get('port'), function(){
    console.log("server listening on port", app.get('port'));
});

var io = require('socket.io').listen(httpServer);


var accountSid = 'AC84ec249b7ee3a71df9071ad29e0d01f6';
var authToken = 'd34d1712ff92c9973b2f0ce64955b77c';
var twilioNumber = "+14244880247";


var client = require('twilio')(accountSid, authToken)
    , speakeasy = require('speakeasy');


io.on('connection', function(socket) {
    console.log('socket.io connected');
    socket.on('register', function(data) {
        var code = speakeasy.totp({key: 'abc123'});
        console.log('Inside Register');
        sendSMS(data.phone_number, code, socket);
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


// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Blood Donation APP started on port 8079');