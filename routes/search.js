"use strict";

var util = require('util');
var db = require('../model/db');

function toc_link(x) {
  return '/' + x.type + '/' + x.urlkey;
}

var search = {
  
  do: function(req,res,next) {
    var query;
    req.search = { term: '' };
    if (!req.query.q) {
      return next();
    }

    req.search.term = req.query.q;
    query = 'select * from toc where type like "%' + req.search.term + '%" or urlkey like "%' 
             + req.search.term + '%" or enname like "%' + req.search.term + '%"';
    db.all(query, function(err,rows) {
      var results = [];
      if (err) {
        util.log('error in search ' + err);
      }

      if (rows) {
        results = rows.map(function(x) {
                    return {
                      title: x.enname,
                      type: x.type,
                      description: x.endesc,
                      href: toc_link(x)
                    };
                  });
      }

      req.search.results = results;
      next();
    });
  },

  render: function(req,res,next) {
    res.render('search', { search: req.search, url: req.url });
  }
};

module.exports = search;
