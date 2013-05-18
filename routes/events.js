"use strict";

var db = require('../model/duas');
var hijri = require('../lib/hijri');
var util = require('util');

function toc_link(x) {
  return '/' + x.type + '/' + x.urlkey;
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

      try {
        ev.links = JSON.parse(ev.links || '[]');
      } catch(e) {
        console.log(e);
        ev.links = [];
      }

      ev.crdate = hijri.getGregorianDate({ day: ev.hijridate, month: ev.hijrimonth -1 });
      ev.month = hijri.months[ev.hijrimonth - 1];
      res.render('events/event', { page: page, event: ev, suffix: hijri.get_nth_suffix(ev.hijridate) });
    });
  },

  index: function(req,res,next) {
    db.all('select * from events order by hijrimonth,hijridate', function(err,rows) {
      var page = { 'title': 'Islamic Occasions', description: 'Upcoming Islamic events with their Hijri and Gregorian dates' };
      var selected = 0;
      var i,row;
      var hdate = req.hijri;
      if (err) { 
        return next(err);
      }

      for(i = 0; i < rows.length; i++) {
        row = rows[i];
        if ( Math.abs((row.hijrimonth - hdate.month)*30 + row.hijridate - hdate.day) < 30) {
           selected = i;
           page.image = '//' + req.headers.host + row.image;
           break;
        }
      }

      res.render('events/index', { events: rows, datehelper: hijri.getDate, page: page, offset: selected });
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
        console.log(x);
        results.push({ 
                        title: x.name, 
                        type: x.type, 
                        description: hijri.getDate(x.hijridate,x.hijrimonth),
                        href: toc_link(x) 
                     });
      });
      next();
    });
  }
};

module.exports = events;
