"use strict";

var db = require('../../model/duas');
var hijri = require('../../lib/hijri');

var ramadhan =  {


  index: function(req,res,next) {
    res.render('months/ramadhan/index');
  },

  dayindex: function(req,res,next) {
    res.render('months/ramadhan/dayindex');
  },

  daily: function(req,res,next) {
    db.get('select * from ramadhandaily where day = ' + req.params.day, function(err,row) {
      if (err) {
        return next(err);
      }
      row.page = { title: 'Daily dua for ' + req.params.day + hijri.get_nth_suffix(req.params.day) + ' Ramadhan ' , description: row.english };
      res.render('months/ramadhan/daily', row);
    });
  }

};

module.exports = ramadhan;
