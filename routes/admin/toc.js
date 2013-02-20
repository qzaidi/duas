"use strict";

var db = require('../../model/duas');

var toc = {
  
  index: function(req,res,next) {
    res.render('admin/toc');
  },

  create: function(req,res,next) {
    db.insert('toc',req.body, function(err,data) {
      var result = { "Result" : "OK" };
      if (err) {
        result.RESULT = 'ERROR';
        result.Message = err.message;
      } else {
        console.log(data);
        result.Record = req.body;
      }
      res.json(result);
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
