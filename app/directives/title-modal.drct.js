'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:titleModal
 * @description
 * # titleModal
 * Directive of the moviesApp
 */
app.directive('titleModal', function (){

	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		templateUrl: 'views/directives/title-modal.html'
	}
});