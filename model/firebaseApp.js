const admin = require('firebase-admin');
const serviceAccount = require('../duas-cf741b0ca377.json');

admin.initializeApp({
  databaseURL: "https://duas-d43d6.firebaseio.com/",
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
