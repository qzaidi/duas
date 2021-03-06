var request = require('request');
var fs = require('fs');
var tee = require('tee');
var path = require('path');

const cacheDir = './public/cache/pdf/';
const pdfgenServer = process.env.PDFSERVER;

var pdf = {

  index: function(req,res,next) {
    var filename = cacheDir + req.params.contentType + '/' + req.params.content;
    
    var url = req.protocol + '://' + req.get('host') + '/' + req.params.contentType + '/' + req.params.content;
    if (req.query && req.query.lang) {
      url += '?lang=' + req.query.lang;
      filename += '-' + req.query.lang;
    }

    filename += '.pdf'

    fs.access(filename, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('going to generate ',filename);
        return pdf.generate(url,filename,res)
      }

      console.log('serving from cache',filename);
      fs.createReadStream(filename).pipe(res);
    });
   },


   generate: function(url,filename,res) {
    var opts = {
      url: 'http://' + pdfgenServer + ':9000/api/render?emulateScreenMedia=false&pdf.printBackground=false&url=' + encodeURI(url),
    };

    var dir = path.dirname(filename)
    if (!fs.existsSync(dir)) {
      console.log('creating path',dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    request.get(opts)
           .on('error',function(err) {
              console.log('error in pdf gen',err,url);
              res.sendStatus(500);
              fs.unlinkSync(filename);// remove generated file
           })
           .on('response',function(response) {
              console.log(response.statusCode)
              if (response.statusCode != 200){
                console.log('got unexpected response',response.statusCode);
              }
           }).pipe(tee(fs.createWriteStream(filename),res))
   }

};


module.exports = pdf
