'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the moviesApp
 */
app.controller('MainCtrl', ['$scope', '$rootScope', 'localStorageService', 'apiService', 'mainService', function ($scope, $rootScope, localStorageService, apiService, mainService) {

	// API CONFIGURATION
	mainService.storeApiConfigData();
	// GENRES LIST
	mainService.storeGenresData();
	
	
}]);