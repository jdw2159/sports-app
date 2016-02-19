var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var client = new pg.Client(connectionString);

client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'), function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('main file sent');
		}
	});
});

router.get('/home/all_teams', function(req, res, next) {
	var results = [];
	var query = client.query('SELECT * FROM teams ORDER BY name ASC');
	query.on('row', function(row) {
		results.push(row);
	});
	query.on('end', function() {
		return res.json(results);
	});
});

router.get('/team/:tid', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'team_page.html'), function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('team file sent');
		}
	});
});

router.get('/team/:tid/all_games', function(req, res, next) {
	var tid = req.params.tid;
	var results = [];
	var query = client.query('SELECT * FROM games WHERE tid_a = $1 OR tid_h = $1 ORDER BY date', [tid]);
	query.on('row', function(row) {
		results.push(row);
	});
	query.on('end', function() {
		return res.json(results);
	});
});

module.exports = router;
