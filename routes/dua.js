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
      if (!err) {
        db.all('select * from ' + req.params.name, function(err,rows) {
          res.render('dua', { data: rows, info: info });
        });
      } else {
        // TODO: handle this
        next(err);
      }
    });
  });

  app.get('/munajat', function(req,res) {
    db.all('select * from toc where type = "munajat"', function(err,rows) {
      res.render('munajats', { prayers: rows });
    });
  });

  app.get('/munajat/:prayer', function(req,res) {
    var lang = req.query.lang || 'english';
    db.get('select * from toc where urlkey = "' + req.params.prayer + '" ', function(err,info) {
      if (!err) {
        db.all('select * from ' + req.params.prayer, function(err,rows) {
          console.log(info);
          res.render('munajat', { data: rows, info: info, lang: lang });
        });
      } else {
        // TODO: handle this
        next(err);
      }
    });
  });


};
