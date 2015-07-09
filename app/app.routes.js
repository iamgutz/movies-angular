'use strict';

/**
 * @ngdoc overview
 * @name moviesApp
 * @description
 * # moviesApp
 *
 * Routes of the application.
 */
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/movies/genre/:genre_id', {
      templateUrl: 'views/movies.html',
      controller: 'MoviesCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});