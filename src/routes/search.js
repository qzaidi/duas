"use strict";

var util = require('util');
var db = require('../model/duas');
var events = require('./events');

function toc_link(x) {
  return '/' + x.type + '/' + x.urlkey;
}

var search = {

  setup: function(req,res,next) {
    var query;
    req.search = { term: req.query.q , results: []};
    if (!req.query.q) {
      return next(new Error('search query missing'))
    }
    next()
  },
  
  toc: function(req,res,next) {
    var query;
    req.search.term = req.query.q;
    query = 'select * from toc where type like "%' + req.search.term + '%" or urlkey like "%' 
             + req.search.term + '%" or enname like "%' + req.search.term + '%" order by type';
    db.all(query, function(err,rows) {
      var results;
      if (err) {
        util.log('error in search ' + err);
        return next();
      }

      if (rows) {
        results = req.search.results;
        rows.forEach(function(x) {
          results.push({
                        title: x.enname,
                        type: x.type,
                        description: x.endesc,
                        href: toc_link(x)
                      });
        });
      }

      next();
    });
  },

  render: function(req,res,next) {
    var days = ['sunday','monday','tuesday','wednesday','thursday','friday', 'saturday'];
    var d = days[(new Date()).getDay()];
    res.render('search', { day: d , page: { title: 'Search for duas', description: 'Search Islamic Supplications, Ziyarats'  }});
  },

  json: function(req,res,next) {
    return res.jsonp(req.search.results);
  },

  autocomplete: function(req,res,next) {
    var data = [ req.query.q ];
    data.push(req.search.results.map(function(x) { return x.title; }));
    res.json(data);
  }
};

module.exports = search;
