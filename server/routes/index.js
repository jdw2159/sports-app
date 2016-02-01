var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
});

router.post('/api/v1/todos', function(req, res) {
	var results = [];
  // Grab data from http request
  var data = {name: req.body.name, city: req.body.city, abbr: req.body.abbr};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query("INSERT INTO teams(name, city, abbr) values($1, $2, $3)", [data.name, data.city, data.abbr]);
    // SQL Query > Select Data
    var query = client.query("SELECT * FROM teams ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
        done();
        return res.json(results);
		});
  });
});

router.get('/api/v1/todos', function(req, res) {
  var results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }
    // SQL Query > Select Data
    var query = client.query("SELECT * FROM teams ORDER BY id ASC;");
    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
        done();
        return res.json(results);
    });
  });
});

module.exports = router;