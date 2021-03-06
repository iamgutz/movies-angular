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
    .when('/movies/genre/:with_genres', {
      templateUrl: 'views/movies.html',
      controller: 'MoviesCtrl'
    })
    .when('/search/:query/:person?/:person_id?', {
      templateUrl: 'views/search.html',
      controller: 'SearchCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});