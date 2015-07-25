'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:rating
 * @description
 * # rating
 * Directive of the moviesApp
 */
app.directive('rating', function (){

	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			percent: '@'
		},
		templateUrl: 'views/directives/rating.html'
	}
});