'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:movieGrid
 * @description
 * # movieGrid
 * Directive of the moviesApp
 */
app.directive('movieGrid', function(){

	var directiveCtrl = function ($scope, $routeParams, apiService, utilsService) {
		var params = {};

		if($scope.localParams === 'true') {
			params.with_genres = ($scope.genreId) ? $scope.genreId : null;
			params.sort_by = ($scope.sortBy) ? $scope.sortBy : null;
		} else {
			params = $routeParams;
		}

        console.log($scope.mikeInfo);

		/**
         * Get Api Configuration
         */
        apiService.storeApiConfigData().then(function (apiConfig){
            $scope.images_base_url = apiConfig.images.base_url;
        });

        /**
         * Get movie genre
         */
        apiService.getGenreData(params.with_genres).then(function (genre){

            $scope.genre_name = genre.name;
        });

        /**
         * Get the movies list
         */
        apiService.getMoviesList(params).then(function (data) {
            var itemsPerGroup = parseInt($scope.groupItems);

			// order the results in groups
			var orderedResults = utilsService.groupArray({
				num: itemsPerGroup,
				array: data.results
			});

			$scope.moviesList = orderedResults;
            console.log(orderedResults);
        });
	}

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			localParams: '@localParams',
	      	posterSize: '@posterSize',
	      	groupItems: '@groupItems',
	      	genreId: '@genreId',
	      	sortBy: '@',
            showInfo: '@'
	    },
        templateUrl: 'views/directives/movie-grid.html',
        controller: ['$scope', '$routeParams', 'apiService', 'utilsService', directiveCtrl]
    };
});