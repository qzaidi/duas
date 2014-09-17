"use strict";

var mailer = require('../lib/mailer');

var defaults = {
  language : {
    arfontsize: 28,
    hifontsize: 18,
    urfontsize: 18
  },
  quran: {
    trans: {
      ar: "selected"
    }
  }
};

var settings = {
  index: function(req,res,next) {
    res.render('settings/index');
  },

  page: function(req,res,next) {
    var settings = req.session.settings || defaults;
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
    res.end(200);
  },

  updateLanguage: function(req,res,next) {
    if (!req.session.settings) {
      req.session.settings = {};
    }

    var settings = { arfontsize: req.body.arfontsize, urfontsize: req.body.urfontsize, hifontsize: req.body.hifontsize };
    req.message = 'Your settings have been applied.';
    req.params.page = 'language';
    req.session.settings.language = settings;
    next();
  },

  updateQuran: function(req,res,next) {
    if (!req.session.settings) {
      req.session.settings = defaults;
    }
    req.params.page = 'quran';
    req.session.settings.quran = req.body;
    console.log(req.session.settings);
    next();
  }


};

module.exports = settings;
