"use strict";

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(__dirname + '/../data/duas', sqlite3.OPEN_READONLY);

module.exports = db;
