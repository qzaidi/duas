"use strict";

var db = require('../model/db');

module.exports = function(app) {

  app.get('/ziyaraat', function(req,res) {
    res.render('ziyaraat/index');
  });

  app.get('/ziyaraat/entry', function(req,res) {
    res.render('ziyaraat/entry');
  });

  app.get('/ziyaraat/salwat', function(req,res) {
    res.render('ziyaraat/salwat');
  });

  app.get('/ziyaraat/:name', function(req,res,next) {
    var name = req.params.name;
    db.get('select * from toc where urlkey = "' + name + '"', function(err,info) {
      if (err) {
        return next(err);
      }
      db.all('select * from "' + name + '"', function(err,rows) {
        if (err) {
          return next(err);
        }
        res.render('ziyaraat/baqeeh', { data: rows, info: info });
      });
    });
  });
};
