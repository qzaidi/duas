"use strict";

var db = require('../model/duas');

var langmap = {
  'english': 'English Translation',
  'engtrans': 'English Transliteration',
  'urdu': 'Urdu Translation',
  'hindi': 'Hindi Translation',
  'arabiconly' : 'Arabic only',
  'hindionly' : 'Hindi only',
  'hintrans' : 'Hindi Transliteration'
};

var helpers = {

  handleEllipsis: function(row) {
    if (row == '...') {
      return '<br/>'
    }
    return row;
  },

  embellish: function(row) {
    if (/\([0-9]*:[0-9-]*\)/.test(row)) {
      return row.replace(/\(([0-9]*:[0-9-]*)\)/,function(verse,p1) {
        var link = '/quran/' + p1.replace(':','/');
        var res = "<a style='color:blue;' href='" + link + "'>" + verse + "</a>"; 
        return res;
      });
    }

    return row;
  }

};

var verses = {
  collection: function(type) {
    return function(req,res,next) {
      var name = req.params.name;
      var title = type[0].toUpperCase() + type.substr(1)

      db.all('select * from toc where type = "' + type + '" and collection = "' + name + '"', function(err,rows) {
        var page;

        if (err) {
          console.log(err);
          return next(err);
        }

        page = { title: type + 's from ' + name, description: rows.length + 'Supplications/Munajats/Ziyarats tagged in ' + name };
        res.render('collection/collection' , { title: title, data: rows, page: page, collection: rows[0].collection });
      });
    };
  },

  get: function(key) {
    return function(req,res,next) {
      db.all('select * from ' + key, function(err,rows) {
        if (!err) {
          req.data[key] = rows;
        } 
        next(err);
      });
    }
  },

  render: function(req,res,next) {
    db.all('select * from ' + req.params.name, function(err,rows) {
      var lang = req.query.lang || 'english';
      var langdesc = langmap[lang];
      var info = req.info;
      var page = { title : info.enname + ' with ' + langdesc, image: '//duas.mobi/img/icon-' + info.type + '.png'};
      var duration, min,sec,ptm;
      var cls = {};
      var url;

      if (info.arname) {
        page.title += ' - ' + info.arname;
      }

      cls[lang] = 'ui-btn-active';

      page.description = info.collection + ' - ' + info.endesc + ' with ' + langdesc;
      page.keywords = info.meta || '';
      url = 'http://duas.mobi/' + info.type + '/' + info.urlkey;

      if (info.audio) {
        page.description += ' and mp3 audio';
      }
      if (!rows[0][lang]) {
        rows[0][lang] = langdesc + ' Coming Soon ...';
      }

      if (duration = rows[rows.length - 1].cue) {
        min = (duration/60)|0;
        sec = duration - min*60;
        ptm = 'PT' + min + 'M' + sec + 'S'
      }

      if (info.link) {
        try {
          info.link = JSON.parse(info.link);
        } catch(e) {
          console.error('Failed to parse link for ' + req.params.name , info.link);
        }
      }
      res.render('verses', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc, cls: cls,
                             rating: (req.rating*10|0)/10, votes: req.votes|0, duration: ptm, url: url, helpers: helpers});
    });
  }
};

module.exports = verses;

(function(){
  if (require.main == module) {
    //console.log(helpers.embellish("and repay those who do good with goodness' (53:31),"));
    console.log(helpers.embellish("'in a book inscribed, witnessed by those brought nigh' (83:20-21),"));
  }
}())
