



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
    socket.on('register', function(data,domain) {
        var secretLink = speakeasy.generateSecret({length: 100});
        var code = speakeasy.totp({
            secret: secretLink.base32,
            encoding: 'base32'
        });
        console.log('Inside Register');
        var postmark = require('./controllers/postmark.mailer.controller');

        var link = domain+"/activate/"+secretLink.base32;
        var fullName = data.donarData.firstName+' '+data.donarData.lastName;

        postmark.sendMail(data.donarData.email,'Thanks for Registering - Please verify your emailID to Donate',fullName,link,
            function() {
                var donar = require('./controllers/donars.controller');
                data.donarData.token = code;
                data.donarData.link = secretLink.base32;
                donar.registerDonar(data.donarData, function (err, data) {
                    if (!err) {
                        socket.emit('registered', {message: "", success: "Registered !!"});
                    }
                    else if (!data) {
                        socket.emit('registered', {message: "Error During Registering"});
                    }
                    else {
                        socket.emit('registered', {message: "", success: "Number is Already Registered!"});
                    }
                });
            });
        //sendSMS(data.phone_number, code, socket,

        //});
    });

    socket.on('verify', function(data) {
        var donar = require('./controllers/donars.controller');
        donar.updateVerification(data.donarData,data.code,function(err,Data){
            if(!err) {
                socket.emit('verified', {message: "",success:"Verified !!"});
            }
            else {
                socket.emit('verified', {message: "Code doesn't Match"});
            }
        });
    });

    socket.on('loadMarkers',function(data){
        var donar = require('./controllers/donars.controller');
        donar.loadMarkers(data,function(err,data){
            socket.emit('loadedMarkers',{ markers: data });
        });
    });
});


function sendSMS(phone_number, code, socket,cb) {
    client.sendSms({
        to: phone_number,
        from: twilioNumber,
        body: 'Your verification code is: ' + code
    }, function(twilioerr, responseData) {
        if(twilioerr){
            socket.emit('registerError', {message: "Error in sending OTP to this number!"});
        }
        else
        {
            cb()
        }
    });
};


// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Blood Donation APP started on port 8079');