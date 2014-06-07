"use strict";

var db = require('../../model/duas');
var hijri = require('../../lib/hijri');

var months = {
  getName: function(req,res,next) {
    var month = hijri.months.indexOf(req.params.month);
    if (month == -1) {
      return next();
    }
    req.hijri = { month: month+1, date: 1 };
    next();
  },

  getInfo: function(req,res,next) {
    var query = 'select rowid,* from months where ';
    
    if (req.hijri) {
      query += 'rowid = ' + req.hijri.month;
    } else {
      query += 'urlkey = "' + req.params.month + '"';
    }

    db.get(query, function(err,info) {
      if (err || !info) {
        return next(new Error('Invalid Month'));
      }

      if (info.info) {
        try {
          info.info = JSON.parse(info.info);
        } catch (e) {
        }
      }

      req.info = info;
      req.hijri = { month: info.rowid, date : 1 };
      next();
    });

  },

  redirect: function(req,res,next) {
    res.redirect('/month/' + req.info.english);
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
    res.render('months', { 
                           events: req.events, 
                           month: month , 
                           datehelper: hijri.getDate,
                           info: req.info,
                           page: {
                            title: month,
                            description: 'Supplications for the month of ' + month
                           }
                         });
  }
};

module.exports = months;
