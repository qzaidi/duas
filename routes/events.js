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

function getDate(ev) {
  var crdate = hijri.getGregorianDate({ day: ev.hijridate, month: ev.hijrimonth -1 });
  var month = hijri.months[ev.hijrimonth - 1];
  return ev.hijridate + get_nth_suffix(ev.hijridate) + ' of ' + month + ' , falls on ' + crdate.toString().split('00:')[0];
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
    db.all('select * from events order by hijrimonth,hijridate', function(err,rows) {
      var page = { 'title': 'Islamic Occasions', description: 'Upcoming Islamic events with their Hijri and Gregorian dates' };
      var selected = 0;
      var hijri = req.hijri;
      if (err) { 
        return next(err);
      }

      for(var i = 0; i < rows.length; i++) {
        var row = rows[i];
        //console.log(hijri.month,hijri.day);
        //console.log(row.hijrimonth,row.hijridate);
        if (  (row.hijrimonth >= hijri.month) 
           && (row.hijridate >= hijri.day) ) {
           selected = i;
           break;
        }
      }
      res.render('events/index', { events: rows, datehelper: getDate, page: page, offset: selected });
    });
  }

};

module.exports = events;
