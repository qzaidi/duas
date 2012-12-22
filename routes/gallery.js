"use strict";

module.exports = function(app) {

  app.get('/gallery', function(req,res) {
    var images = [
      [ 
        {
          name: 'Sajjad, Karbala',
          file: '1.jpg',
        },
        {
          name: 'Prayer is the firm recourse against troubles - Imam Sajjad.',
          file: '2.jpg',
        },
        {
          name: 'Jannat-ul-Baqeeh before the demolition',
          file: '3.jpg',
        }
      ],
      [
        {
          name: 'Salutations on Imam Sajjad, son of the Prophet of Allah',
          file: '4.jpg',
        },
        {
          name: 'Imam Sajjad',
          file: '5.jpg',
        },
        {
          name: 'Chief of the Prostrators',
          file: '6.jpg',
        }
      ],
      [
        {
          name: 'Jannatul Baqeeh after demolition',
          file: '7.jpg',
        },
        {
          name: 'Chief of the Prostrators',
          file: '8.jpg',
        },
        {
          name: 'Couplet in praise of Imam Sajjad (by Iktishaf)',
          file: '9.jpg',
        }

      ]

    ];

    res.render('gallery', { rows: images });
  });


};
