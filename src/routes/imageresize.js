"use  strict";

const sharp = require('sharp');
const util = require('util');
const fs = require('fs');
const path = require('path');

var imageresize = {
  render: function(req,res,next) {
    var width = parseInt(req.params[0]);
    var height = parseInt(req.params[1]);
    var src = './public/' + req.params[2];
    var dest = './public/' + req.url;

    if (req.accepts('image') == null) {
      var err = new Error('Not Found');
      err.status = 404;
      console.log(src + ' was not found');
      return next(err);
    }

    sharp(src).resize(width,height).toBuffer(function(err,data) {
      if (!err) {
        console.log('writing thumbnail to ' + dest);
        fs.writeFile(dest, data, "binary",function(err) {
          if (err) {
            util.log("failed to write file",dest)
          }
        });
      } else {
        util.log('imageresize:' + err);
      }
      res.type(path.basename(dest));
      res.end(data);
    });

  }
};

module.exports = imageresize;
