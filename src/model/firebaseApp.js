const admin = require('firebase-admin');
const serviceAccount = require('../../firebase.json');

admin.initializeApp({
  databaseURL: "https://duas-d43d6.firebaseio.com/",
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
