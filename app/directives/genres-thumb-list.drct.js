'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:GenresListCtrl
 * @description
 * # GenresListCtrl
 * Controller of the moviesApp
 */
app.directive('genresThumbList', function(){
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'directives/genres-thumb-list.html',
        controller: 'GenresListCtrl'
    };
});