"use strict";

var db = require('../model/db');

var treatise = {

  index: function(req,res,next) {
    res.render('treatise');
  },

  list: function(req,res,next) {
    db.all('select * from treatise', function(err,rights) {

      if (err) {
        util.log(err);
        return next(err);
      }

      res.render('rights/list', { rights: rights });
    });
  },

  right: function(req,res,next) {
    var id = Number(req.params.right);
    db.get('select * from treatise where id=' + id, function(err,info) {
      var link = (id < 51) ? info.id + 1: undefined;
      if (err) {
        return next(err);
      }
      console.log(link);
      res.render('rights/index' , { info: info , next: link });
    });
    
  }
};

module.exports = treatise;
