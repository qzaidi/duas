"use strict";

var db = require('../model/duas');

function toc_link(x) {
  return '/' + x.type + '/' + x.image;
}

var gallery = {
  index: function(req,res,next) {
    db.all('select * from gallery', function(err,rows) {
      var page = { title: 'Image gallery', description: 'Images related to Imam Zainul Abideen' };
      var images = [];
      var subarray = [];
      var i;
      if (err) { return next(err); }
      for (i = 0; i < rows.length; i++) {
        subarray.push(rows[i]);
        if (i % 3 == 2) {
          images.push(subarray);
          subarray = [];
        }
      }
      if (subarray.length) { 
        images.push(subarray);
      }
      res.render('gallery/index', { rows: images, page: page });
    });
  },

  render: function(req,res,next) {
    db.get('select * from gallery where image="' + req.params.image  + '"', function(err,rows) {
      res.render('gallery/image', { info: rows });
    });
  },

  search: function(req,res,next) {
    var query = 'select * from gallery where description like "%' + req.search.term + '%"';
    db.all(query, function(err,rows) {
      var results = req.search.results;
      if (err) {
        util.log('error in gallery search ' + err);
      }
      rows.forEach(function(x) {
        x.type = 'gallery';
        results.push({ 
          title: x.name, 
          type: x.type, 
          description: x.description,
          href: toc_link(x) 
        });
      });
      next();
    });
  }
};

module.exports = gallery;
