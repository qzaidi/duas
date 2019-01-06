"use strict";

var praytimes = {
  save: function(req,res,next) {
    req.session.coords = req.body;
    res.json({});
  },

  render: function(req,res,next) {
    console.log(req.session);
    res.render('praytimes');
  }
};

module.exports = praytimes;
