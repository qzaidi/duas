"use strict";

// TODO: this will come from DB.
var keydates = {
  'arbaeen': {
    page: {
      'title': 'Arbaeen 2013',
      'description': 'Arbaeen (Chehlum) of Imam Husain was marked by 25 million Shia Muslims in Karbala. ' +
      'Watch Arbaeen Videos , read the ziyarat of Arbaeen.',
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
  },
  'zainab-martyrdom' : {
    page: {
    'title': 'Martyrdom Anniversary of Sayyeda Zainab binte Ali',
    'description': 'Lady Zainab, the illustrious daughter of Imam Ali, and the torch bearer of Karbala',
    'image': '/img/zainab.jpg'
   }
  }
};

var dates = {
  page: function(req,res,next) {
    var info = keydates[req.params.page];
    if (!info) {
      return next(new Error('Not Found'));
    }

    if (info.page.image.indexOf('http') != 0) {
      info.page.image = 'http://' + req.host + info.page.image;
    }
    res.render('dates/' + req.params.page, { page: info.page });
  }
};

module.exports = dates;
