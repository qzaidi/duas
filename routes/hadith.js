"use strict";
var db = require('../model/duas');
var helpers = require('./helpers');

var hadith = {

  fetch: function(req,res,next) {
    var key = req.params.hadith;
    var id = Math.min(req.params.id,40);
    var query = 'select * from toc where type = "hadith" and urlkey = "' + key + '"';

    db.get(query, function(err,data) {
      if (err || !data) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }

      db.get('select * from  ' + data.tabname + ' where rowid = ' + id, function(err,row) {
        req.data = { hadith: row, id: id, collection: key, name: data.enname , helpers: helpers};
        next(err);
      });

    });
  },

  index: function(req,res,next) {
    var query = 'select * from toc where type = "hadith"';
    db.all(query, function(err,rows) {
      if (err || !rows || rows.length == 0) {
        err = new Error('Not Found');
        err.status = 404;
      }

      req.data = { ahadith: rows };
      next(err);

    });
  },

  random: function(req,res,next) {
    var query = 'select * from toc where type = "hadith"';
    db.all(query, function(err,rows) {

      var rand1 = (Math.random()*rows.length)|0;
      var rand2 = (Math.random()*40)|0 + 1;
      var selected = rows[rand1];
      var query = 'select * from ' + selected.tabname + ' where rowid = ' + rand2;
      db.get(query, function(err,row) {
        req.data = { hadith: row, id: rand2, collection: selected.urlkey, name: selected.enname , helpers: helpers};
        next(err);
      });
    });

  }

};

module.exports = hadith;
