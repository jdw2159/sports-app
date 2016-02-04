var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var client = new pg.Client(connectionString);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
});

router.get('/all_teams', function(req, res, next) {
  client.connect();
  var results = [];
  var query = client.query("SELECT * FROM teams ORDER BY name ASC");
  query.on('row', function(row) {
    results.push(row);
  });
  query.on('end', function() {
    client.end();
    return res.json(results);
  });
});

module.exports = router;
