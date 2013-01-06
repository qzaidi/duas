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
    delete req.body.arname;
    db.update("toc", req.body, [ 'urlkey' ], function(err,data) {
      var result = { "Result": "OK" };
      if (err) {
        console.log(err);
        result.Result = 'ERROR';
        result.message = err.message;
      }

      res.json(result);
    });
  },

  remove: function(req,res,next) {
    res.json({
      "Result": "OK"
    });
  }
};

module.exports = toc;
