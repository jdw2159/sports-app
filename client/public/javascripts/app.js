angular.module('sportsApp', [])

.controller('mainCtrl', function($scope, $http) {

	$scope.teams = [];

	$http.get('/all_teams').then(function(response) {
		$scope.teams = response.data;
	})
});
