'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:MoviesCtrl
 * @description
 * # MainCtrl
 * Controller of the moviesApp
 * @todo
 * # Implement infinitescoll as pagination method
 */
app.controller('MoviesCtrl', ['$scope', '$routeParams', 'apiService', 'utilsService', function ($scope, $routeParams, apiService, utilsService) {
	var params = $routeParams;

	console.log('params: ', params);

	apiService.getGenreData(params.with_genres).then(function (genre){
		$scope.genre_name = genre.name;
	});
	
}]);