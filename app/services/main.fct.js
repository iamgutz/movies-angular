'use strict';

/**
 * @ngdoc function
 * @name moviesApp.factory:mainService
 * @description
 * # mainService
 * Factory of the moviesApp
 */

 app.factory('mainService', ['$http', '$q', '$rootScope', '$location', 'localStorageService', function ($http, $q, $rootScope, $location, localStorageService){
 	
 	function getCurrentPage() {
 		return localStorageService.get('currentPage');
 	}

 	function getPreviousPage() {
 		return localStorageService.get('previousPage');
 	}

 	function saveCurrentPage() {
 		var currentPage = $location.path();
 		var previousPage = getCurrentPage();

 		if(previousPage) {
 			savePreviousPage(previousPage);
 		}
 		localStorageService.add('currentPage', currentPage);
 	}

 	function savePreviousPage(path) {
 		localStorageService.add('previousPage', path);
 	}

	// Return public
	return {
		getCurrentPage: getCurrentPage,
		getPreviousPage: getPreviousPage,
		saveCurrentPage: saveCurrentPage,
		savePreviousPage: savePreviousPage
	}
 }]);