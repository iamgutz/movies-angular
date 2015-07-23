'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:genresMenu
 * @description
 * # genresMenu
 * Directive of the moviesApp
 */
app.directive('searchBox', function (){

	var lastSearch;
	var previousPage; 

	function directiveCtrl ($scope, $routeParams, $window, $location, apiService, utilsService){
		previousPage = $location.path();
		
		$scope.search = function() {
			if($scope.searchInput !== lastSearch) {
				if($scope.searchInput === '') {
					console.log('go back');
					$location.path(previousPage);
				} else {
					lastSearch = $scope.searchInput;
					console.log('searching', lastSearch);
					$location.path('/search/'+$scope.searchInput);
				}
			} 
			
		}
	}


	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/search-box.html',
		controller: ['$scope', '$routeParams', '$window', '$location', 'apiService', 'utilsService', directiveCtrl]
	}
});