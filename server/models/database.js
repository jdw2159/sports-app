var path = require('path');
var Promise = require('promise');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

function createTables() {
	console.log('creating teams table')
	// makes sure that teams gets created first
	var query = client.query('CREATE TABLE IF NOT EXISTS teams(tid SERIAL PRIMARY KEY, \
		name text not null UNIQUE, abbr text not null, espn_token text not null, \
		city text, state text, lat real, long real)');
	query.on('end', function(result) {
		// console.log(result.rowCount + ' rows were received');
		// console.log(JSON.stringify(result.rows, null, "    "));
		console.log('creating games table')
		query = client.query('CREATE TABLE IF NOT EXISTS games(gid SERIAL, tid_h int \
			REFERENCES teams(tid) not null, tid_a int REFERENCES teams(tid) \
			not null, date text not null, UNIQUE (tid_h, tid_a, date))')
		query.on('end', function(result) {
			client.end();
		});
	});
}

createTables();
