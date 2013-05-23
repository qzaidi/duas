var QuranData;
var $;

function showTOC() {
  "use strict";

  function errCallback(tx,err){
    console.log("Oh noes! There haz bin a datamabase error!");
    console.log(err);
  }

  var db = openDatabase("quran", "1.0", "Offline Quran DB", 32678);

  var loadMeta = function(successCallback) {
    db.transaction(function(transaction){
      transaction.executeSql(("SELECT * FROM metadata;"),null,
      function(transaction, results){successCallback(results);}, errCallback);
    });
  };

 loadMeta(function(res) {
   var i;
   var len = res.rows.length;
   var items = [];
   for (i = 0; i < len; i++) {
     items.push((res.rows.item(i)));
   }
   dust.render("chapters",{ chapters: items }, function(err,out) {
     $('#chapterlist').append(out).listview('refresh');
   });
 });
}

function init() {
  "use strict";

  function errCallback(tx,err){
    console.log("Oh noes! There haz bin a datamabase error!");
    console.log(err);
  }


  var db = openDatabase("quran", "1.0", "Offline Quran DB", 32678);

  db.transaction(function(transaction) {
    transaction.executeSql("CREATE TABLE IF NOT EXISTS metadata (" +
      "start INTEGER , ayas INTEGER, ord INTEGER, rukus INTEGER, arname TEXT, tname TEXT, enname TEXT,"
    + " type TEXT, id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT);");
  });

  db.transaction(function(transaction) {
    transaction.executeSql("CREATE TABLE IF NOT EXISTS quran (" +
      "chapter INTEGER , verse INTEGER, ar TEXT) ;");
  });

 var saveMeta = function(data, successCallback){
   db.transaction(function(transaction){
     data.forEach(function(x) {
       transaction.executeSql(("INSERT INTO metadata VALUES (?,?,?,?,?,?,?,?,?);"), 
       x, function(transaction, results){successCallback(results);}, errCallback);
     });
   });
 };

 var saveQuran = function(data,successCallback){
   db.transaction(function(transaction){
     data.forEach(function(x,idx) {
      transaction.executeSql(("INSERT INTO quran VALUES (?,?,?);"), 
        x, function(transaction, results){ 
          if (idx == data.length - 1) {
            successCallback(results);
          }
        }, errCallback);
     });
   });
 };

 /* Load TOC */
 db.transaction(function(tx) {
   tx.executeSql(("select count(*) as len from metadata;"),
   null, function(tx,res) {
    var len = res.rows.item(0).len;
    if (len != 114) { 
      $.mobile.showPageLoadingMsg('e','Loading Quran Metadata ...');
      var data = QuranData.Sura.slice(1,115);
      data.forEach(function(x,id) {
        var chapter = id + 1;
        x.push(chapter);
      });
      saveMeta(data,function(ins) {
        $.mobile.showPageLoadingMsg('e','Loaded Quran Metadata.');
      });

      $.mobile.showPageLoadingMsg('e','Downloading Quran Text ..');
      $.getJSON('/api/quran',function(res) {
        $.mobile.showPageLoadingMsg('e','Saving Quran Text for offline viewing ..');
        saveQuran(res, function(ins) {
          $.mobile.showPageLoadingMsg('e','Completed');
          $.mobile.hidePageLoadingMsg();
          showTOC();
        });
      });
    } else {
      showTOC();
    }
   }, errCallback);
 });
}

$(document).on('pageinit','#quranOffline', init);

$( document ).on( "pagebeforechange", function( e, data ) {
  if (typeof data.toPage === 'string') {
    console.log('topage' + data.toPage);
    if (data.toPage.indexOf('#offquran') > 1){
      $.mobile.chapter = data.toPage.substring(data.toPage.indexOf('?')+1);
    }
  }
});
