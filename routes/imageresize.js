"use  strict";

var magickwand = require('magickwand');
var util = require('util');
var fs = require('fs');
var path = require('path');
var mime = require('express').mime;

var imageresize = {
  render: function(req,res,next) {
    var width = req.params[0];
    var height = req.params[1];
    var src = './public/' + req.params[2];
    var dest = './public/' + req.url;

    if (mime.lookup(req.params[2]).match('image') == null) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    magickwand.thumbnail(src, { width: width, height:height },function(err, data, info) {
      if (!err) {
        console.log('writing thumbnail to ' + dest);
        fs.writeFile(dest, data, "binary");
      } else {
        util.log('imageresize:' + err);
      }
      res.type(path.basename(dest));
      res.end(data);
    });

  }
};

module.exports = imageresize;
