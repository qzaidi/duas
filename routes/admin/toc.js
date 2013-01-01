"use strict";

var db = require('../../model/db');

var toc = {
  
  index: function(req,res,next) {
    res.render('admin/toc');
  },

  create: function(req,res,next) {
    res.json({
      "Result": "OK",
      "Record": req.body
    });
  },

  list: function(req,res,next) {
    db.all('select * from toc', function(err,data) {
      res.json({
        "Result":"OK",
        "Records": data
      });
    });
  },

  update: function(req,res,next) {
    res.json({
      "Result": "OK"
    });
  },

  remove: function(req,res,next) {
    res.json({
      "Result": "OK"
    });
  }
};

module.exports = toc;
