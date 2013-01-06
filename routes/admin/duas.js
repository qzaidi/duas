"use strict";
var db = require('../../model/db');

var duas = {
  index: function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name + '" and type="dua"', function(err,info) {
      res.render('admin/dua', { info: info });
    });
  },

  list: function(req,res,next) {
    db.all('select rowid,* from ' + req.params.name, function(err,rows) {
      res.json({
        "Result":"OK",
        "Records": rows
      });
    });
  }
};

module.exports = duas;
