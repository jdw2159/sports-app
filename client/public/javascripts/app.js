var app = angular.module('sportsApp', ['ui.bootstrap'])

app.controller('mainCtrl', function($scope, $http) {

	$scope.teams = [];

	$http.get('/home/all_teams').then(function(response) {
		$scope.teams = response.data;
	});
});

app.controller('teamCtrl', function($scope, $http, $location) {

	var url = $location.absUrl().split('/');
	var tid = url[url.length - 1]

	$scope.games = [];

	$http.get('/team/' + tid + '/all_games').then(function(response) {
		$scope.games = response.data;
	});
});
