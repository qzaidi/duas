"use strict";

var util = require('util');
var db = require('../model/duas');

var quotes = {

  fetch: function(req,res,next) {
    var key = req.param.tag;

    db.get('select * from quote where urlkey = ' + key, function(err,row) {

      if (err || !row) {
        // this is probably because we are at the end, so reset id
        util.log('error occured ' + err);
        return err?next(err):res.redirect('/qunoot/1');
      }

      req.quote = row;

      next();
    });
  },

  render: function(req,res,next) {
    res.render('quotes',{ quote: req.quote });
  }

};

module.exports = quotes;
