var path = require('path');
var request = require('request');

var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var client = new pg.Client(connectionString);

// client.connect();

request("https://www.kimonolabs.com/api/cz62oi1w?apikey=RzlH1CszbtL3YsvWJ0BTKcmIhEzkCHLa", 
function(err, response, body) {

	var myJson = JSON.parse(body);
	var count = myJson.count;
	var games = myJson.results.nba_schedule;

	for (i = 0; i < count; i++) {
		var game = games[i];
		var home, away;
		var url_team = game.url.substr(game.url.lastIndexOf('/') + 1);
		var opponent = game.opponent.href.substr(game.opponent.href.lastIndexOf('/') + 1);
		if (game.location === "vs") {
			home = url_team;
			away = opponent;
		} else if (game.location === "@") {
			home = opponent;
			away = url_team;
		}
		console.log(home + " vs " + away);
	}
});