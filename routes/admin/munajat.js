"use strict";

var db = require('../../model/db');

var munajat = {
  index: function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name + '" and type="munajat"', function(err,info) {
      res.render('admin/munajat', { info: info });
    });
  },

  list: function(req,res,next) {
    db.all('select rowid,* from ' + req.params.name, function(err,rows) {
      res.json({
        "Result":"OK",
        "Records": rows
      });
    });
  },

  create: function(req,res,next) {


  },

  update: function(req,res,next) {
    var sql = 'update ' + req.params.name + ' set urdu = "' + req.body.urdu + '", cue = "' +  req.body.cue + '" where rowid=' + req.body.rowid; 
    console.log(sql);
    db.run(sql, function(err,st) {
      var resp = { "Result": "OK" };
      if (err) {
        console.log(err);
        resp.Result = 'ERROR';
        resp.message = err.message;
      }
      res.json(resp);
    });
  },

  remove: function(req,res,next) {

  }
};

module.exports = munajat;
