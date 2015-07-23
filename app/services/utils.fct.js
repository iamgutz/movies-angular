'use strict';

/**
 * @ngdoc function
 * @name moviesApp.factory:utilsService
 * @description
 * # utilsService
 * Factory of the moviesApp
 */

 app.factory('utilsService', function (){
 	
 
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
		groupArray: groupArray
	}
 });