'use strict';

/**
 * @ngdoc function
 * @name moviesApp.factory:apiService
 * @description
 * # apiService
 * Factory of the moviesApp
 */

 app.factory('mainService', ['$http', '$q', '$rootScope', 'localStorageService', 'apiService', function ($http, $q, $rootScope, localStorageService, apiService){

 	function storeApiConfigData (){
 		var deferred = $q.defer();

 		var storedData = localStorageService.get('apiConfig');

		if(!storedData) {
			// No data in Local Storage, request to factory service.
			apiService.getApiConfig().then(function (data) {
				localStorageService.add('apiConfig', data);
				deferred.resolve(data);

				//$rootScope.$broadcast('apiConfigAvailable', data);
				console.log('api Config stored');
			});
		} else {
			console.log('api Config available in localstorage');
			//$rootScope.$broadcast('apiConfigAvailable', storedData);
			deferred.resolve(storedData);
		}

		return deferred.promise;

 	}

 	function storeGenresData (){
 		var deferred = $q.defer();

 		var storedData = localStorageService.get('movieGenres');

		if(!storedData) {
			// No data in Local Storage, request to factory service.
			apiService.getGenresList().then(function (data) {
				localStorageService.add('movieGenres', data.genres);
				deferred.resolve(data.genres);

				//$rootScope.$broadcast('movieGeneresAvailable', data.genres);
				console.log('movie genres stored');
			});
		} else {
			console.log('movie genres available in localstorage');
			//$rootScope.$broadcast('movieGeneresAvailable', storedData);
			deferred.resolve(storedData);
		}

		return deferred.promise;

 	}

 	function getGenreData (id){
 		var deferred = $q.defer();
 		var genre_id = parseInt(id);

 		storeGenresData().then(function (genres){
 			for(var i = 0; i < genres.length; i++) {

 				if(genres[i].id === genre_id) {
 					deferred.resolve(genres[i]);
 					return;
 				}

 			}
 		});
 		
 		return deferred.promise;
 	}

 	function groupArray (params) {
 		var newArray = [];
 		var newGroup = [];
 		for(var i = 0; i <= params.array.length; i++){
 			if(i > 0 && i%params.num === 0) {
 				newArray.push(newGroup);
 				newGroup = [];
 			}
 			newGroup.push(params.array[i]);
 		}

 		return newArray;
 	}

	// Return public
	return {
		groupArray: groupArray,
		storeGenresData: storeGenresData,
		storeApiConfigData: storeApiConfigData,
		getGenreData: getGenreData
	}
 }]);