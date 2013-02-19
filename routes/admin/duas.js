"use strict";
var db = require('../../model/duas');

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
  },

  update: function(req,res,next) {
    db.update(req.params.name, req.body, [ 'rowid' ], function(err,st) {
      var resp = { "Result": "OK" };
      if (err) {
        console.log(err);
        resp.Result = 'ERROR';
        resp.Message = err.message;
      } 
      res.json(resp);
    });
  }
};

module.exports = duas;
