var request = require('request');

var pdf = {

  index: function(req,res,next) {
    var url = req.protocol + '://' + req.get('host') + '/' + req.params[0];
    if (req.query && req.query.lang) {
      url += '?lang=' + req.query.lang;
    }
     
    var opts = {
      url: 'http://127.0.0.1:9000/api/render?emulateScreenMedia=false&pdf.printBackground=false&url=' + encodeURI(url),
    };

    request.get(opts)
           .on('error',function(err) {
              console.log('error in pdf gen',err,req.url);
           })
           .pipe(res);
  }

};


module.exports = pdf
