var firebase = require('firebase')

firebase.initializeApp({
  databaseURL: "https://duas-d43d6.firebaseio.com/",
  serviceAccount: "./duas-cf741b0ca377.json"
});

var db = firebase.database();

module.exports = db;
