"use strict";
var db = require('../../model/duas');

var ziyarat = {
  index: function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name + '" and type="ziyarat"', function(err,info) {
      res.render('admin/ziyarat', { info: info });
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
    Object.keys(req.body).forEach(function(k) {
      if (req.body[k] == '') {
        delete req.body[k];
      }
    });
    db.update(req.params.name, req.body, [ 'rowid' ], function(err,data) {
      var result = { "Result": "OK" };
      if (err) {
        console.log(err);
        result.Result = 'ERROR';
        result.message = err.message;
      }
      res.json(result);
    });
  },

};

module.exports = ziyarat;
