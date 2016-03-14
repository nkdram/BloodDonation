// Require
var postmark = require("postmark");
//var config = require('./config/config');
var client = new postmark.Client("e586ab50-379b-41fe-8dc9-91749ae7a5c1");

exports.sendMail = function(toAddress,subject,name,link,callBack){
   console.log(link);
    var bodyText = getBodyText(link,name);
    client.sendEmail({
        "From": "automailer@connectwithdonars.in",
        "To": toAddress,
        "Subject": subject,
        "HtmlBody": bodyText
    }, function (err, to) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Email sent to: %s", to);
        }
        callBack();
    });

};

var getBodyText = function(link,fullName){

 var body =

    '<div id="mailsub" class="notification" align="center"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width: 320px;"><tr><td align="center" bgcolor="#eff3f8">'
    +


    '<!--[if gte mso 10]>'+
    '<table width="680" border="0" cellspacing="0" cellpadding="0">'+
    '<tr><td>'
    +'<![endif]-->'

    + '<table border="0" cellspacing="0" cellpadding="0" class="table_width_100" width="100%" style="max-width: 680px; min-width: 300px;">'
    +'<tr><td>'
    +' <!-- padding --><div style="height: 80px; line-height: 80px; font-size: 10px;"> </div>'
    +' </td></tr>'
    + ' <!--header -->'
    + '<tr><td align="center" bgcolor="#ffffff"><!-- padding --><div style="height: 30px; line-height: 30px; font-size: 10px;"> </div>'
    + '<table width="90%" border="0" cellspacing="0" cellpadding="0">'
    +  '<tr><td align="left"><!--Item --><div class="mob_center_bl" style="float: left; display: inline-block; width: 115px;">'
    + '<table class="mob_center" width="115" border="0" cellspacing="0" cellpadding="0" align="left" style="border-collapse: collapse;">'
    + '<tr><td align="left" valign="middle">'
    +'<!-- padding --><div style="height: 20px; line-height: 20px; font-size: 10px;"> </div>'
    + '<table width="115" border="0" cellspacing="0" cellpadding="0" >'
    + '<tr><td align="left" valign="top" class="mob_center">'
    + ' <!--<a href="#" target="_blank" style="color: #596167; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">'
    + '<font face="Arial, Helvetica, sans-seri; font-size: 13px;" size="3" color="#596167">'
    + '<img src="http://artloglab.com/metromail/images/logo.gif" width="115" height="19" alt="BloodDonate" border="0" style="display: block;" /></font>'
    + '</a> -->'
    + '</td></tr>'
    + '</table>'
    + ' </td></tr>'
    + '</table></div><!-- Item END--><!--[if gte mso 10]>'
    + '</td>'
    + '<td align="right">'
    + '  <![endif]--><!--'

    +   ' Item --><div class="mob_center_bl" style="float: right; display: inline-block; width: 88px;">'
    + '<table width="88" border="0" cellspacing="0" cellpadding="0" align="right" style="border-collapse: collapse;">'
    +'<tr><td align="right" valign="middle">'
    +'<!-- padding --><div style="height: 20px; line-height: 20px; font-size: 10px;"> </div>'
    +'<table width="100%" border="0" cellspacing="0" cellpadding="0" >'
    +'<tr><td align="right">'
    +'<!--social -->'
    +'<div class="mob_center_bl" style="width: 88px;">'
    +'<!--<table border="0" cellspacing="0" cellpadding="0">'
    +'<tr><td width="30" align="center" style="line-height: 19px;">'
    +'<a href="#" target="_blank" style="color: #596167; font-family: Arial, Helvetica, sans-serif; font-size: 12px;">'
    +'<font face="Arial, Helvetica, sans-serif" size="2" color="#596167">'
    +'<img src="http://artloglab.com/metromail/images/facebook.gif" width="10" height="19" alt="Facebook" border="0" style="display: block;" /></font></a>'
    +'</td><td width="39" align="center" style="line-height: 19px;">'
    +'<a href="#" target="_blank" style="color: #596167; font-family: Arial, Helvetica, sans-serif; font-size: 12px;">'
    +'<font face="Arial, Helvetica, sans-serif" size="2" color="#596167">'
    +'<img src="http://artloglab.com/metromail/images/twitter.gif" width="19" height="16" alt="Twitter" border="0" style="display: block;" /></font></a>'
    +'</td><td width="29" align="right" style="line-height: 19px;">'
    +'<a href="#" target="_blank" style="color: #596167; font-family: Arial, Helvetica, sans-serif; font-size: 12px;">'
    +'<font face="Arial, Helvetica, sans-serif" size="2" color="#596167">'
    +'<img src="http://artloglab.com/metromail/images/dribbble.gif" width="19" height="19" alt="Dribbble" border="0" style="display: block;" /></font></a>'
    +'</td></tr>'
    +'</table> -->'
    +'</div>'
    +'<!--social END-->'
    +'</td></tr>'
    +'</table>'
    +'</td></tr>'
    +'</table></div><!-- Item END--></td>'
    +'</tr>'
    +'</table>'
    +'<!-- padding --><div style="height: 50px; line-height: 50px; font-size: 10px;"> </div>'
    +'    </td></tr>'
    +'    <!--header END-->'

    +'<!--content 1 -->'
    +'<tr><td align="center" bgcolor="#fbfcfd">'
    +'    <table width="90%" border="0" cellspacing="0" cellpadding="0">'
    +'    <tr><td align="center">'
    +'    <!-- padding --><div style="height: 60px; line-height: 60px; font-size: 10px;"> </div>'
    +'    <div style="line-height: 44px;">'
    +'    <font face="Arial, Helvetica, sans-serif" size="5" color="#57697e" style="font-size: 34px;">'
    +'    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 34px; color: #57697e;">'
    +'    Thanks for Registering ' + fullName + '.'
    +'</span></font>'
    +'</div>'
    +'<!-- padding --><div style="height: 40px; line-height: 40px; font-size: 10px;"> </div>'
    +'    </td></tr>'
    +'   <tr><td align="center">'
    +'   <div style="line-height: 24px;">'
    +'   <font face="Arial, Helvetica, sans-serif" size="4" color="#57697e" style="font-size: 15px;">'
    +'   <span style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #57697e;">'
    +'   Please click below link<br> to activate your account.'
    +'</span></font>'
    +'</div>'
    +'<!-- padding --><div style="height: 40px; line-height: 40px; font-size: 10px;"> </div>'
    +'    </td></tr>'
    +'   <tr><td align="center">'
    +'   <div style="line-height: 24px;">'
    +'   <a href="'+ link +'" target="_blank" style="color: #596167; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">'
    +'   <font face="Arial, Helvetica, sans-seri; font-size: 13px;" size="3" color="#596167">'
    +'   <img src="http://www.connectwithdonars.in/assets/modules/core/img/FindPage.png" width="100%" height="100%" alt="activate link" border="0" style="display: block;" /></font></a>'
    +'   </div>'
    +'   <!-- padding --><div style="height: 60px; line-height: 60px; font-size: 10px;"> </div>'
    +'   </td></tr>'
    +'   </table>'
    +'   </td></tr>'
    +'   <!--content 1 END-->'



    +'<!--footer -->'
    +'<tr><td class="iage_footer" align="center" bgcolor="#ffffff">'
    +'    <!-- padding --><div style="height: 80px; line-height: 80px; font-size: 10px;"> </div>'

    +'    <table width="100%" border="0" cellspacing="0" cellpadding="0">'
    +'    <tr><td align="center">'
    +'    <font face="Arial, Helvetica, sans-serif" size="3" color="#96a5b5" style="font-size: 13px;">'
    +'    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #96a5b5;">'
    +'     2016 © www.connectwithdonars.in. STILL NO Rights Reserved.'
    +'</span></font>'
    +'</td></tr>'
    +'</table>'

    +'<!-- padding --><div style="height: 30px; line-height: 30px; font-size: 10px;"> </div>'
    +'    </td></tr>'
    +'    <!--footer END-->'
    +'<tr><td>'
    +'    </td></tr>'
    +'    </table>'
    +'<!-- padding --><div style="height: 80px; line-height: 80px; font-size: 10px;"> </div>'
    +'    <!--[if gte mso 10]>'
    +'</td></tr>'
    +'</table>'
    +'<![endif]-->'

    +'</td></tr>'
    +'</table>'

    +'</div>';

    return body;
};