"use strict";

var db = require('../../model/db');

var treatise = {

  index: function(req,res,next) {
    res.render('admin/treatise');
  },

  list: function(req,res,next) {
    db.all('select rowid,* from treatise', function(err,rows) {
      res.json({
        "Result":"OK",
        "Records": rows
      });
    });
  },

  create: function(req,res,next) {


  },

  update: function(req,res,next) {
    db.update(req.params.name, req.body, [ 'id' ], function(err,st) {
      var resp = { "Result": "OK" };
      if (err) {
        console.log(err);
        resp.Result = 'ERROR';
        resp.Message = err.message;
      } 
      res.json(resp);
    });
  },

  remove: function(req,res,next) {

  }
};

module.exports = treatise;
