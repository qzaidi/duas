"use strict";

var db = require('../model/duas');

module.exports = function(app) {

  app.get('/ziyaraat', function(req,res) { 
    res.redirect('/ziyarat');
  });

  app.get('/ziyarat', function(req,res) {
    db.all('select * from toc where collection = "Ziyarat"', function(err,info) {
      res.render('ziyaraat/index', { ziyarats: info });
    });
  });

  app.get('/ziyaraat/entry', function(req,res) {
    res.render('ziyaraat/entry');
  });

  app.get('/ziyaraat/salwat', function(req,res) {
    res.render('ziyaraat/salwat');
  });

  app.get('/ziyarat/:name', function(req,res,next) {
    var name = req.params.name;
    db.get('select * from toc where urlkey = "' + name + '"', function(err,info) {
      var page = {};
      if (err) {
        return next(err);
      }

      page.title = info.enname;
      page.description = info.endesc;

      db.all('select * from "' + name + '"', function(err,rows) {
        if (err) {
          return next(err);
        }
        res.render('ziyaraat/baqeeh', { data: rows, info: info, lang: 'english', page: page });
      });
    });
  });
};
