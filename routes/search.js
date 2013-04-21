"use strict";

var util = require('util');
var db = require('../model/duas');
var events = require('./events');

function toc_link(x) {
  return '/' + x.type + '/' + x.urlkey;
}

var search = {
  
  toc: function(req,res,next) {
    var query;
    req.search = { term: '' , results: []};
    if (!req.query.q) {
      return next();
    }

    req.search.term = req.query.q;
    query = 'select * from toc where type like "%' + req.search.term + '%" or urlkey like "%' 
             + req.search.term + '%" or enname like "%' + req.search.term + '%"';
    db.all(query, function(err,rows) {
      var results;
      if (err) {
        util.log('error in search ' + err);
        return next();
      }

      if (rows) {
        req.search.results = rows.map(function(x) {
                    return {
                      title: x.enname,
                      type: x.type,
                      description: x.endesc,
                      href: toc_link(x)
                    };
                  });
      }

      next();
    });
  },

  render: function(req,res,next) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'];
    var d = days[(new Date()).getDay()];
    res.render('search', { day: d });
  },

  json: function(req,res,next) {
    return res.jsonp(req.search.results);
  }
};

module.exports = search;
