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
		console.log('current page: ', mainService.getCurrentPage());
	});
	
	// API CONFIGURATION
	apiService.storeApiConfigData();
	// GENRES LIST
	apiService.storeGenresData();

	$scope.titleModal = function(title_id){
		$scope.title_modal = {};
		console.log('resquesting title');
		apiService.getMovieInformation(title_id).then(function(data){
			$scope.title_modal = data;
			console.log('title_modal: ', data);
		});
	}

	// HELPERS
	// 
	$scope.getYear = function(date){
		if(date) {
			var dateArray = date.split('-');
			return dateArray[0];
		}
	}

	$scope.duration = function(totalMinutes){
		var hours = Math.floor(totalMinutes / 60);
		var minutes = totalMinutes % 60;
		return ''+hours+'h '+minutes+'m';
	}

	$scope.toPercent = function(num){
		return num * 10;
	}
	
}]);