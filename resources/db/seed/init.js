"use strict";

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

fs.readFile('data', function(err,data) {
  var lines = data.toString().split('\n');
  var rows = [];
  lines.forEach(function(line) {
    var m;

    if (line.length < 1)
      return;

    m = line.match(/^[0-9A-Za-z, :!."\(\)]+/);
    if (m) {
      rows.push([ m[0], line.substring(m[0].length) ]);
    } else {
      console.log('failed on ' + line);
      console.log(m);
      process.exit(1);
    }
  });

  initdb(rows);
});

function initdb(rows) {
  var db = new sqlite3.Database('duas');
  db.serialize(function() {
    db.run("CREATE TABLE praise (english TEXT,arabic TEXT)");

    var stmt = db.prepare("INSERT INTO praise VALUES (?,?)");

    rows.forEach(function(row) {
      stmt.run(row);
    });

    stmt.finalize();

    db.each("SELECT * FROM praise", function(err, row) {
      if (!err) {
        console.log(row);
      } else { 
        console.log(err);
      }
    });
  });

  db.close();
}
