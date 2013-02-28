"use strict";

var mailer = require('../lib/mailer');

var settings = {
  index: function(req,res,next) {
    res.render('settings/index');
  },

  page: function(req,res,next) {
    var settings = req.session.settings || { lang: {}, arfontsize: 28 };
    var message = req.message || '';
    res.render('settings/' + req.params.page, { message: message, settings: settings });
  },

  feedback: function(req,res,next) {
    mailer.sendMail({
      to: 'qasim@zaidi.me',
      subject: 'Feedback from webapp',
      body: JSON.stringify(req.body)
    }, function(err,res) {
      console.log(err || res);
    });
    next();
  },

  update: function(req,res,next) {
    var settings = { lang: { }, arfontsize: req.body.arfontsize };
    req.message = 'Your settings have been applied';
    req.params.page = 'language';
    settings.lang[req.body.language] = 'selected';
    req.session.settings = settings;
    next();
  }
};

module.exports = settings;
