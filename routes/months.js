"use strict";

var db = require('../model/duas');
var hijri = require('../lib/hijri');

var months = {
  getName: function(req,res,next) {
    var month = hijri.months.indexOf(req.params.month);
    if (!month && Number(month)) {

    }
    req.hijri = { month: month+1, date: 1 };
    
    next();
  },

  events: function(req,res,next) {
    var hdate = req.hijri;
    db.all('select * from events where hijrimonth=' + hdate.month +' order by hijridate', function(err,rows) {
      req.events = rows;
      next(err);
    });
  },

  render: function(req,res,next) {
    var hdate = req.hijri;
    var month = hijri.months[hdate.month - 1];
    res.render('months', { events: req.events, month: month , datehelper: hijri.getDate });
  }

};

module.exports = months;
