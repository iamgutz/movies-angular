'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:featuredMovie
 * @description
 * # featuredMovie
 * Directive of the moviesApp
 */
app.directive('featuredMovie', function(){
    var directiveCtrl = function ($scope, $routeParams, apiService) {
        var params = {};

        if($scope.localParams === 'true') {
            params.with_genres = ($scope.genreId) ? $scope.genreId : null;
        } else {
            params = $routeParams;
        }

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
            var random = Math.floor((Math.random() * data.results.length) + 1);
            $scope.featured_movie = data.results[random];
        });
    }

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			localParams: '@localParams',
	      	backdropSize: '@backdropSize',
	      	genreId: '@genreId'
	    },
        templateUrl: 'views/directives/featured-movie.html',
        controller: ['$scope', '$routeParams', 'apiService', directiveCtrl]
    };
});