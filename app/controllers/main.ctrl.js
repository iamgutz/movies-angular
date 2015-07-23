'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moviesApp
 */
app.controller('MainCtrl', ['$scope', '$rootScope', '$window', 'mainService', 'apiService', 'utilsService', function ($scope, $rootScope, $window, mainService, apiService, utilsService) {
	
	// detect when the url path changes
	$scope.$on('$routeChangeSuccess', function(){
		// Store Current Page
		mainService.saveCurrentPage();
		console.log(mainService.getCurrentPage());
	});
	
	// API CONFIGURATION
	apiService.storeApiConfigData();
	// GENRES LIST
	apiService.storeGenresData();

	function responsiveFontSize () {
 		var w = angular.element($window);
 		w.bind('resize', function () {
			console.log('resize', w);
		});
 	}
	responsiveFontSize()
	
}]);