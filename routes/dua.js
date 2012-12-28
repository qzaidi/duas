"use strict";

var db = require('../model/db');

module.exports = function(app) {

  app.get('/duas', function(req,res) {
    db.all('select * from toc where type = "dua"', function(err,rows) {
      res.render('duas', { data: rows });
    });
  });

  app.get('/dua/:name', function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
      if (err) {
        return next(err);
      }
      db.all('select * from ' + req.params.name, function(err,rows) {
        var page = { title : info.enname + ' from Imam Sajjad' };
        page.description = info.collection + ' - ' + info.endesc;
        console.log(page);
        res.render('dua', { data: rows, info: info, page: page });
      });
    });
  });

  app.get('/munajat', function(req,res) {
    db.all('select * from toc where type = "munajat"', function(err,rows) {
      res.render('munajats', { prayers: rows });
    });
  });

  app.get('/munajat/:prayer', function(req,res) {
    db.get('select * from toc where urlkey = "' + req.params.prayer + '" ', function(err,info) {
      var lang = req.query.lang || 'english';
      if (err) {
        return next(err);
      }
      db.all('select * from ' + req.params.prayer, function(err,rows) {
        var page = { title : info.enname  + ' from Imam Sajjad' };
        page.description = info.collection + ' - ' + info.endesc;
        res.render('munajat', { data: rows, info: info, lang: lang, page: page });
      });
    });
  });


};
