var path = require('path');
var request = require('request');

var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var client = new pg.Client(connectionString);

client.connect();

request("https://www.kimonolabs.com/api/ej4gcxkw?apikey=RzlH1CszbtL3YsvWJ0BTKcmIhEzkCHLa", 
function(err, response, body) {

	var myJson = JSON.parse(body);
	var count = myJson.count;
	var all_teams = myJson.results.team_info;

	var num = 0;

	for (i = 0; i < count; i++) {
		var team_info = all_teams[i];

		var name = team_info.team.text;
		var city = team_info.city.text;
		var state = team_info.state.text;
		var lat = team_info.lat;
		var lng = team_info.long;

		// var arena = team_info.state.text;

		// var query = client.query('SELECT tid FROM teams WHERE name = $1', [name]);
		// query.on('error', function(error) {
		// 	console.log('got an error');
		// })
		// query.on('row', function(row) {
		// 	console.log('team found with tid: ' + row['tid']);
		// })
		// query.on('end', function() {
		// 	// do nothing
		// });

		var query = client.query('UPDATE teams SET city = $1, state = $2, lat = $3, \
			lng = $4 WHERE name = $5', [city, state, lat, lng, name]);
		query.on('error', function(error) {
			console.log('got an error');
		})
		query.on('end', function() {
			console.log('updated team location info # ' + (num + 1) );
			num++;
			if (num === 30) {
				client.end();
			}
		})
	}
});

