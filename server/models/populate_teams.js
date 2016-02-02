var path = require('path');
var request = require('request');

var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var client = new pg.Client(connectionString);

client.connect();

request("https://www.kimonolabs.com/api/3kneoqdm?apikey=RzlH1CszbtL3YsvWJ0BTKcmIhEzkCHLa", 
function(err, response, body) {

	var myJson = JSON.parse(body);
	var count = myJson.count;
	var all_teams = myJson.results.collection1;

	for (i = 0; i < count; i++) {
		var team_info = all_teams[i];
		var url_arr = team_info.teams.href.split('/');

		var team_name = team_info.teams.text;
		var espn_token = url_arr[url_arr.length - 1];
		var espn_abbr = url_arr[url_arr.length - 2];

		var query = client.query('INSERT INTO teams (tid, name, abbr, espn_token) \
			VALUES (DEFAULT, $1, $2, $3)', [team_name, espn_abbr, espn_token]);
		query.on('end', function(result) {
			if (i === count - 1) {
				client.end();
			}
		});
	}
});