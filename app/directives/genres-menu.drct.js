'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:genresMenu
 * @description
 * # genresMenu
 * Directive of the moviesApp
 */
app.directive('genresMenu', function(){
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'views/directives/genres-menu.html',
        controller: 'GenresListCtrl'
    };
});