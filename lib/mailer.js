"use strict";

var nodemailer = require('nodemailer');

var config = {
  transportMethod: "SMTP",
  transport: {
    service: "Gmail",
    auth: {
      user: "qasim@zaidi.me",
      pass: "wcrqjswgdkeoxmtw"
    }
  }
};

var mailer = nodemailer.createTransport(config.transportMethod, 
                                        config.transport);

module.exports = mailer;

(function() {
  if (require.main === module) {
    mailer.sendMail( {
      to: 'qasim.zaidi@gmail.com',
      subject: 'test mail',
      body: 'hi there, \n Testing email functionality'
    }, function(err,res) {
      console.log(err || res);
      mailer.close();
    });
  }
}());
