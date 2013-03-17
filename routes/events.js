"use strict";

var db = require('../model/duas');
var hijri = require('../lib/hijri');

function toc_link(x) {
  return '/' + x.type + '/' + x.urlkey;
}

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

  getDate: function(ev) {
    var crdate = hijri.getGregorianDate({ day: ev.hijridate, month: ev.hijrimonth -1 });
    var month = hijri.months[ev.hijrimonth - 1];
    return ev.hijridate + get_nth_suffix(ev.hijridate) + ' of ' + month + ' , falls on ' + crdate.toString().split('00:')[0];
  },

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

      try {
        ev.links = JSON.parse(ev.links || '[]');
      } catch(e) {
        console.log(e);
        ev.links = [];
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
        if ( Math.abs((row.hijrimonth - hijri.month)*30 + row.hijridate - hijri.day) < 30) {
           selected = i;
           page.image = '//' + req.headers.host + row.image;
           break;
        }
      }

      res.render('events/index', { events: rows, datehelper: events.getDate, page: page, offset: selected });
    });
  },

  search: function(req,res,next) {
    var query = 'select * from events where name like "%' + req.search.term  + '%" or description like "%'
                + req.search.term + '%" or urlkey like "%' + req.search.term + '%"';
    db.all(query, function(err,rows) {
      var results = req.search.results;
      if (err) {
        util.log('error in events search ' + err);
      }
      rows.forEach(function(x) {
        x.type = 'events';
        results.push({ 
                        title: x.name, 
                        type: x.type, 
                        description: events.getDate(x),
                        href: toc_link(x) 
                     });
      });
      next();
    });
  }
};

module.exports = events;
