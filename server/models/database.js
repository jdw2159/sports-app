var path = require('path');
var Promise = require('promise');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

function createTables() {
	console.log('creating teams table')
	var query = client.query('CREATE TABLE teams(tid SERIAL PRIMARY KEY, \
		name VARCHAR(20) not null, city VARCHAR(20) not null, state VARCHAR(2) \
		not null, lat real, long real, abbr VARCHAR(4))');
	query.on('end', function(result) {
		// console.log(result.rowCount + ' rows were received');
		// console.log(JSON.stringify(result.rows, null, "    "));
		console.log('creating games table')
		query = client.query('CREATE TABLE games(gid SERIAL, tid_h smallint \
			REFERENCES teams(tid) not null, tid_a smallint REFERENCES teams(tid) \
			not null, date date not null, UNIQUE (tid_h, tid_a, date))')
		query.on('end', function(result) {
			client.end();
		});
	});
}

createTables();
