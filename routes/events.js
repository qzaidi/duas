"use strict";

var db = require('../model/db');
var hijri = require('../lib/hijri');

function get_nth_suffix(date) {
  switch (date) {
    case 1:
    case 21:
    case 31:
      return 'st';
    case 2:
    case 22:
      return 'nd';
    case 3:
    case 23:
      return 'rd';
    default:
      return 'th';
  }
}

var events = {
  
  page: function(req,res,next) {
    var urlkey = req.params.page;
    var sql = 'select * from events where urlkey = "' + urlkey + '"';
    db.get(sql, function(err,ev) {
      var page = {};
      if (err) {
        return next(err);
      }

      page.title = ev.name;
      page.image = ev.image;
      page.description = ev.metadesc;
      if (page.image.indexOf('http') != 0) {
        page.image = 'http://' + req.headers.host + page.image;
      }

      ev.crdate = hijri.getGregorianDate({ day: ev.hijridate, month: ev.hijrimonth -1 });
      ev.month = hijri.months[ev.hijrimonth - 1];
      res.render('events/event', { page: page, event: ev, suffix: get_nth_suffix });
    });
  },

  index: function(req,res,next) {
    res.render('events/index');
  }

};

module.exports = events;