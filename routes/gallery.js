"use strict";

module.exports = function(app) {

  app.get('/gallery', function(req,res) {
    var images = [
      {
        name: '',
        file: '1.jpg',
      },
      {
        name: '',
        file: '2.jpg',
      },
      {
        name: 'Jannat-ul-Baqeeh before the demolition',
        file: '3.jpg',
      },
      {
        name: 'Salutations on Imam Sajjad, son of the Prophet of Allah',
        file: '4.jpg',
      },
      {
        name: '',
        file: '5.jpg',
      },
      {
        name: 'Chief of the Prostrators',
        file: '6.jpg',
      }


    ];

    res.render('gallery', { images: images });
  });


};
