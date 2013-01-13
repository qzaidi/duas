"use strict";

var db = require('../../model/db');

var gallery = {
  
  index: function(req,res,next) {
    res.render('admin/gallery');
  },

  create: function(req,res,next) {
    db.insert('gallery',req.body, function(err,data) {
      var result = { "Result" : "OK" };
      if (err) {
        result.Result = 'ERROR';
        result.Message = err.message;
      } else {
        console.log(data);
        result.Record = req.body;
      }
      res.json(result);
    });
  },

  update: function(req,res,next) {
    db.update("gallery", req.body, [ 'rowid' ], function(err,data) {
      var result = { "Result": "OK" };
      if (err) {
        console.log(err);
        result.Result = 'ERROR';
        result.Message = err.message;
      }
      res.json(result);
    });
  },

  list: function(req,res,next) {
    db.all('select rowid,* from gallery', function(err,rows) {
      var result = { "Result": "OK" };
      if (err) {
        console.log(err);
      } else {
        result.Records = rows;
      }
      res.json(result);
    });
  },

  remove: function(req,res,next) {
    res.json ( { "Result": "ERROR", "Message": "Not Implemented" });

  }
};

module.exports = gallery;
