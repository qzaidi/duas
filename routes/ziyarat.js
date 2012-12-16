"use strict";

var db = require('../model/db');

module.exports = function(app) {

  app.get('/ziyaraat', function(req,res) {
    res.render('ziyaraat/index');
  });

  app.get('/ziyaraat/baqeeh', function(req,res,next) {
    db.get('select * from toc where urlkey = "ziyarat"', function(err,info) {
      if (!err) {
        db.all('select * from "ziyarat"', function(err,rows) {
          res.render('ziyaraat/baqeeh', { data: rows, info: info });
        });
      } else {
        next(err);
      }
    });
  });

  app.get('/ziyaraat/:episode', function(req,res) {
    res.render('ziyaraat/' + req.params.episode);
  });

};
