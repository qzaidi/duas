"use strict";

var db = require('../model/db');
var hijri = require('../lib/hijri');


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
      ev.crdate = hijri.getGregorianDate({ day: ev.hijridate, month: ev.hijrimonth -1 });
      ev.month = hijri.months[ev.hijrimonth - 1];
      res.render('dates/index', { page: page, event: ev });
    });
  }
};

module.exports = events;
