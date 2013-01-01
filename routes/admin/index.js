"use strict";

var db = require('../model/db');

module.exports = function(app) {
  app.get('/admin/toc', function(req,res,next) {
    res.render('admin/toc');
  });

  app.post('/admin/toc/list', function(req,res,next) {
    db.all('select * from toc', function(err,data) {
      res.json({
        "Result":"OK",
        "Records": data
      });
    });
  });

  app.post('/admin/toc/create', function(req,res,next) {
    res.json({
      "Result": "OK",
      "Record": req.body
    });
  });
  
  app.post('/admin/toc/delete', function(req,res,next) {
    res.json({
      "Result": "OK"
    });
  });

  app.post('/admin/toc/update', function(req,res,next) {
    res.json({
      "Result": "OK"
    });
  });
};
