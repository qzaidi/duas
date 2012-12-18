"use strict";

var mailer = require('../lib/mailer');

var settings = {
  index: function(req,res,next) {
    res.render('settings/index');
  },

  page: function(req,res,next) {
    res.render('settings/' + req.params.page);
  },

  feedback: function(req,res,next) {
    mailer.sendMail({
      to: 'qasim@zaidi.me',
      subject: 'Feedback from webapp',
      body: JSON.stringify(req.body)
    }, function(err,res) {
      console.log(err || res);
    });
    res.json({});
  }

};

module.exports = settings;
