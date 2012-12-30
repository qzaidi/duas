"use strict";

// TODO: this will come from DB.
var keydates = {
  'arbaeen': {
    page: {
      'title': 'Arbaeen 2013',
      'description': 'Arbaeen of the martyrs of Karbala',
      'image': '/img/arbaeen.jpg'
    },
  },
  'imamreza': {
    page: {
      'title': 'Martyrdom of Imam Ali Reza',
      'description': 'Imam Ali Reza was martyred on 17th of Safar',
      'image': '/img/imamreza.jpg'
    }
  },
  'sakina' : {
    page: {
      'title': 'Martyrdom of Sakina, 17th of Safar',
      'description': 'Imam Husain\'s beloved daughter died of cold and starvation in Yazeed\'s Prison',
      'image': '/img/sakina.jpg'
    }
  }
};

var dates = {
  page: function(req,res,next) {
    var info = keydates[req.params.page];
    if (!info) {
      return next(new Error('Not Found'));
    }

    info.page.image = 'http://' + req.host + info.page.image;
    res.render('dates/' + req.params.page, { page: info.page });
  }
};

module.exports = dates;
