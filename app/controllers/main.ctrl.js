'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moviesApp
 */
app.controller('MainCtrl', ['$scope', '$rootScope', 'localStorageService', 'apiService', 'utilsService', '$window', function ($scope, $rootScope, localStorageService, apiService, utilsService, $window) {

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