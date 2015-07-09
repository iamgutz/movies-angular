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
app.controller('MoviesCtrl', ['$scope', '$routeParams', 'apiService', 'mainService', function ($scope, $routeParams, apiService, mainService) {
	var params = $routeParams;
	console.log('params: ', params);

	mainService.storeApiConfigData().then(function (apiConfig){
		console.log(apiConfig);
		$scope.images_base_url = apiConfig.images.base_url;
	});

	mainService.getGenreData(params.genre_id).then(function (genre){
		$scope.genre_name = genre.name;
	});

	apiService.getGenreMoviesList(params).then(function (data) {
		var orderedResults = mainService.groupArray({
			num: 4,
			array: data.results
		});
		
		data.results = orderedResults;
		
		$scope.moviesList = data.results;
		console.log(data.results);
	});
	
}]);