"use strict";
var db = require('../model/duas');
var qurandb = require('quran');
var util = require('util');

var salat = {

  index: function(req,res,next) {

    db.all('select * from salat', function(err,rows) {
      res.render('salat/index',{ rows: rows });
    });

  },

  page: function(req,res,next) {
    res.render('salat/' + req.params.page, req.data);
  },

  search: function(req,res,next) {
    var query = 'select * from salat where enname like "%' + req.search.term  + '%"' +
                ' or urlkey like "%' + req.search.term + '%"';


    db.all(query, function(err,rows) {
      var results = req.search.results;
      if (err) {
        util.log('error in salat search ' + err);
      }

      rows.forEach(function(x) {
        x.type = 'salat';
        results.push({ 
                        title: x.enname, 
                        type: x.type, 
                        description: x.arname,
                        href: '/salat/' + x.urlkey
                     });
      });
      next();
    });
  },

  verses: function(req,res,next) {
    db.get('select * from salat where urlkey = "' + req.params.key + '"', function(err,salat) {
      var data = {};

      if (err || !salat) {
        return next(err || new Error('Not Found'));
      }

      req.salat = salat;

      if (salat.surah) {
        var chapters = salat.surah.split(',');
        var count = chapters.length;

        chapters.forEach(function(chapter) {
          var options = { language: 'en' };
          var x = chapter.split(':');
          chapter = x[0];
          var key = "q" + chapter;
          options.offset = x[1] || 0;
          if (options.offset) {
            x = options.offset.split('-');
            options.offset = x[0];
            key += "v"+ options.offset;
            options.limit = (x[1] - x[0]) || 1;
          }
          qurandb.select({ chapter: chapter }, options, function(err,verses) {
            data[key] = verses;
            count--;

            if (count ==0) {
              req.data = data;
              next();
            }
          });
        });
      } else {
        next();
      }
    });
  },

  duas : function(req,res,next) {
    if (!req.salat.verses) {
      return next();
    }

    var duas = req.salat.verses.split(',');
    var count = duas.length;

    if (!req.data) {
      req.data = {};
    }


    duas.forEach(function(dua) {
      db.all('select * from ' + dua, function(err,rows) {
        if (!err) {
          req.data[dua] = rows;
        } 
        count--;
        if (count == 0) {
          next();
        }
      });
    });
  },

  render: function(req,res,next) {
    res.render('salat/' + req.params.key, req.data);
  }

};

module.exports = salat;
