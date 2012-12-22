"use strict";

var treatise = {

  index: function(req,res,next) {
    res.render('treatise');
  },

  right: function(req,res,next) {
    res.render('rights/' + req.params.right);
  }
};

module.exports = treatise;
