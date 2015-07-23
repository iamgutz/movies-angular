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
app.controller('SearchCtrl', ['$scope', '$routeParams', 'apiService', 'utilsService', function ($scope, $routeParams, apiService, utilsService) {
	var params = $routeParams;

	console.log('params: ', params);

	apiService.searchMulti(params.query).then(function (results){
        console.log(results);
    });
	
}]);