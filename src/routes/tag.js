var db = require('../model/duas');

var tag = {
  listing: function(req,res,next) {
    var tag = req.params.tag;
    var collection = tag[0].toUpperCase() + tag.substring(1);
    
    db.all('select * from collection_map where collection = "' + collection + '" order by type,sort', function(err,rows) {
      res.render('collection/tag', { data: rows, tag: collection });
    });
  }
};

module.exports = tag;
