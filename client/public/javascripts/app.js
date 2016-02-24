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

app.controller('mapCtrl', function($scope, $http) {
	initMap = function() {
		var mapDiv = document.getElementById('map');
		var map = new google.maps.Map(mapDiv, {
			center: {lat: 44.540, lng: -78.546},
			zoom: 8
		});
	};
});

app.directive('myNavbar', function() {
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		templateUrl: "/navbar.html"
	};
});
