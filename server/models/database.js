var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE teams(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, city VARCHAR(40) not null, abbr VARCHAR(40) not null)');
query.on('end', function() { client.end(); });

