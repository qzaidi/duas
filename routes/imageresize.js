"use  strict";

var magickwand = require('magickwand');
var util = require('util');
var fs = require('fs');
var path = require('path');

var imageresize = {
  render: function(req,res,next) {
    var width = req.params[0];
    var height = req.params[1];
    var src = './public/img/' + req.params[2];
    var dest = './public/' + req.url;

    console.log(req.params);

    magickwand.thumbnail(src, { width: width, height:height },function(err, data, info) {
      if (!err) {
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
