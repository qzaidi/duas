"use strict";

var nodemailer = require('nodemailer');

var config = {
  transport: {
    service: "Gmail",
    auth: {
      user: "process.env.EMAILUSER",
      pass: "process.env.EMAILPASS"
    }
  }
};

var mailer = nodemailer.createTransport(config.transport);

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
