var path = require('path');
// var request = require('request');
var fs = require('fs');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var client = new pg.Client(connectionString);
client.connect();

// request("https://www.kimonolabs.com/api/cz62oi1w?apikey=RzlH1CszbtL3YsvWJ0BTKcmIhEzkCHLa",
// function(err, response, body) {
function populate() {
	// var myJson = JSON.parse(body);
	var myJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'json/', 'nba_schedule.json'), 'utf8'));
	var count = myJson.count;
	var games = myJson.results.nba_schedule;

	var dict = {};
	var dict2 = {};

	var query = client.query('SELECT tid, abbr FROM teams');
	query.on('row', function(row) {
		dict[row['abbr']] = row['tid'];
	});
	query.on('end', function() {
		var query = client.query('SELECT tid, espn_token FROM teams');
		query.on('row', function(row) {
			dict2[row['espn_token']] = row['tid'];
		});
		query.on('end', function() {
			parseGames();
		})
	});

	function parseGames() {
		for (i = 0; i < count; i++) {
			var game = games[i];
			var home, away;

			var team_arr = game.url.split('/');
			var opp_arr = game.opponent.href.split('/');

			var team_abbr =  team_arr[team_arr.length - 2].toLowerCase();
			var opp_abbr = opp_arr[opp_arr.length - 2].toLowerCase();

			var team_token = game.url.substring(game.url.lastIndexOf('/') + 1)
			var opp_token = game.opponent.href.substring(game.opponent.href.lastIndexOf('/') + 1)

			var num = 0;

			if (game.location === "vs") {
				home = team_abbr;
				away = opp_abbr;
				home_token = team_token;
				away_token = opp_token;
			} else if (game.location === "@") {
				home = opp_abbr;
				away = team_abbr;
				home_token = opp_token;
				away_token = team_token;
			}

			var home_tid = dict[home];
			var away_tid = dict[away];

			if (!home_tid) {
				home_tid = dict2[home_token];
			}
			if (!away_tid) {
				away_tid = dict2[away_token];
			}

			var game_date = game.date.split(' ');
			var db_format_date = '' + game_date[0] + '-' + game_date[1];
			if (game_date[0] == 'Oct' || game_date[0] == 'Nov' || game_date[0] == 'Dec' ) {
				db_format_date += '-15'
			}
			else {
				db_format_date += '-16'
			}

			var query = client.query('INSERT INTO games VALUES (DEFAULT, $1, $2, $3)',
				[home_tid, away_tid, db_format_date]);
			query.on('error', function(error) {
				// do nothing
			})
			query.on('end', function() {
				num++;
				console.log('inserted game # ' + num);
				if (num === 1231) {
					// celtics had a duplicate game that was postponed
					var query = client.query('DELETE FROM games WHERE tid_a = 1 AND date = \'Jan-23-16\'');
					query.on('end', function() {
						client.end();
					});
				}
			})
		}
	};
};

populate();
