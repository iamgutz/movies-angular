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

	function directiveCtrl ($scope, $routeParams, $window, $location, mainService, apiService, utilsService){
		
		$scope.search = function() {
			if($scope.searchInput !== lastSearch) {
				if($scope.searchInput === '') {
					// get previous page stored in session
					previousPage = mainService.getPreviousPage();
					$location.path(previousPage);
				} else {
					// change the current URL with the values in the input
					// The search request will be done by the search view controller
					lastSearch = $scope.searchInput;
					$location.path('/search/'+$scope.searchInput);
				}
			} 
			
		}
	}


	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/search-box.html',
		controller: ['$scope', '$routeParams', '$window', '$location', 'mainService', 'apiService', 'utilsService', directiveCtrl]
	}
});