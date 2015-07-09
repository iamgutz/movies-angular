'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:GenresListCtrl
 * @description
 * # GenresListCtrl
 * Controller of the moviesApp
 */
app.controller('GenresListCtrl', ['$scope', '$rootScope', 'localStorageService', 'apiService', 'mainService', function ($scope, $rootScope, localStorageService, apiService, mainService) {

	var storedMovieGenres = localStorageService.get('movieGenres');

	if(!storedMovieGenres) {
		// No data in Local Storage, request to factory service.
		apiService.getGenresList().then(function (data) {
			console.log('movie genres retrived, stored and broadcasted');
			$scope.genresList = data.genres;
		});
	} else {
		$scope.genresList = storedMovieGenres;
		console.log(storedMovieGenres);
	}

	$scope.saveGenre = function(obj) {

		console.log(obj);
	}

}]);