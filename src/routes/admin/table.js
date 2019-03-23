"use strict";

module.exports = function(app,dbmodel,auth,table) {
  var db = dbmodel;
  var routes = {

    index: function(req,res,next) {
      res.render('admin/' + table);
    },

    create: function(req,res,next) {
      db.insert(table,req.body, function(err,data) {
        var result = { "Result" : "OK" };
        if (err) {
          result.RESULT = 'ERROR';
          result.Message = err.message;
        } else {
          result.Record = req.body;
        }
        res.json(result);
      });
    },

    list: function(req,res,next) {
      var query = 'select rowid, * from ' + table;
      var referer = req.header('Referer');
      
      if (referer) {
        var args = referer.split('?');

        // very hacky - must be sanitised
        if (args.length > 1 && args[1]) {
          query += ' where ' + unescape(args[1]);
        }
      }

      query += ' order by rowid desc';
      if (req.query.jtPageSize) {
        query += ' limit ' + req.query.jtPageSize;
      }
      if (req.query.jtStartIndex) {
        query += ' offset ' + req.query.jtStartIndex;
      }

      console.log(query)

      db.all(query, function(err,data) {
        db.get('select count(1) as count from ' + table, function(err,count) {
          res.json({
            "TotalRecordCount": count.count,
            "Result":"OK",
            "Records": data
          });
        });
      });
    },

    update: function(req,res,next) {
      Object.keys(req.body).forEach(function(k) {
        if (req.body[k] == '') {
          delete req.body[k];
        }
      });

      db.update(table, req.body, [ 'rowid' ], function(err,data) {
        var result = { "Result": "OK" };
        if (err) {
          console.log(err);
          result.Result = 'ERROR';
          result.message = err.message;
        }

        res.json(result);
      });
    },

    remove: function(req,res,next) {
      db.delete(table, req.body, function(err,data) {
        res.json({
          "Result": "OK"
        });
      });
    }
  };
  console.log('installing routes for ' + table);

  app.get('/admin/' + table, auth,routes.index);
  app.post('/admin/' + table + '/list', auth, routes.list);
  app.post('/admin/' + table + '/create', auth, routes.create);
  app.post('/admin/' + table + '/update', auth, routes.update);
  app.post('/admin/' + table + '/remove', auth, routes.remove);
};
