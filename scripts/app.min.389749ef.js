'use strict';

/**
 * @ngdoc overview
 * @name moviesApp
 * @description
 * # moviesApp
 *
 * Main module of the application.
 */
var app = angular.module('moviesApp', 
  [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule'
  ]
);
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
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:MoviesCtrl
 * @description
 * # MainCtrl
 * Controller of the moviesApp
 * @todo
 * # Implement infinitescoll as pagination method
 */
app.controller('MoviesCtrl', ['$scope', '$routeParams', 'apiService', 'utilsService', function ($scope, $routeParams, apiService, utilsService) {
	var params = $routeParams;

	console.log('params: ', params);

	apiService.getGenreData(params.with_genres).then(function (genre){
		$scope.genre_name = genre.name;
	});
	
}]);
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:MoviesCtrl
 * @description
 * # MainCtrl
 * Controller of the moviesApp
 * @todo
 * # Implement infinitescoll as pagination method
 */
app.controller('SearchCtrl', ['$scope', '$routeParams', 'apiService', 'utilsService', function ($scope, $routeParams, apiService, utilsService) {
	var params = $routeParams;
	$scope.categories = {};
	$scope.params = $routeParams;

	console.log('params: ', params);

	/**
     * Get Api Configuration
     */
    apiService.storeApiConfigData().then(function (apiConfig){
        $scope.images_base_url = apiConfig.images.base_url;
    });


	/**
     * Get Search Results
     */
	apiService.searchMulti(params.query).then(function (data){
        var results = data.results;
        $scope.query = encodeURI(params.query);

        for (var i = 0; i < results.length; i++) {
        	var item = results[i];

        	if(!$scope.categories[item.media_type]){
        		$scope.categories[item.media_type] = [];
        	}

        	$scope.categories[item.media_type].push(item);
        }

        console.log('categorized results: ', $scope.categories);
    });


	/**
     * Get Actor / Person information if the params person and person_id are present
     */
    if(params.person_id){
    	apiService.getPersonInformation(params.person_id).then(function (data){
    		console.log('person info: ', data);
    		$scope.person = data;
    		if($scope.person.birthday){
    			var birthDate = $scope.person.birthday.split('-');
	    		var deathDate = $scope.person.deathday.split('-');
	    		$scope.person.lifetime = (deathDate.length == 3) ? birthDate[0] + ' - ' + deathDate[0] : birthDate[0] + ' - Present';
    		}
    	});
    	apiService.getPersonCredits(params.person_id).then(function (data){
    		console.log('person credits: ', data);
    		var cast = data.cast;
    		$scope.person_cast = {};

    		for (var i = 0; i < cast.length; i++) {
	        	var item = cast[i];

	        	if(!$scope.person_cast[item.media_type]){
	        		$scope.person_cast[item.media_type] = [];
	        	}

	        	$scope.person_cast[item.media_type].push(item);
	        }
 			console.log('cast:',$scope.person_cast);
    	});
    }
	
}]);
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.controller:GenresListCtrl
 * @description
 * # GenresListCtrl
 * Controller of the moviesApp
 */
app.controller('GenresListCtrl', ['$scope', '$rootScope', 'localStorageService', 'apiService', 'utilsService', function ($scope, $rootScope, localStorageService, apiService, utilsService) {

	var storedMovieGenres = localStorageService.get('movieGenres');

	if(!storedMovieGenres) {
		// No data in Local Storage, request to factory service.
		apiService.getGenresList().then(function (data) {
			console.log('movie genres retrived, stored and broadcasted');
			$scope.genresList = data.genres;
		});
	} else {
		$scope.genresList = storedMovieGenres;
		console.log(storedMovieGenres);
	}

	$scope.saveGenre = function(obj) {

		console.log(obj);
	}

}]);
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.factory:apiService
 * @description
 * # apiService
 * Factory of the moviesApp
 */

 app.factory('apiService', ['$http', '$q', '$rootScope', 'localStorageService', function ($http, $q, $rootScope, localStorageService){
 	var api = {
	    api_key: 'f77872cef86d6b860440a3b570e542b0',
	    base_url: 'http://api.themoviedb.org/3',
	    path: {
	    	configuration: '/configuration',
		    genre_movie_list: '/genre/movie/list',
		    genre_id_movies: '/genre/{id}/movies',
		    discover_movies: '/discover/movie',
		    movie_id: '/movie/{id}',
		    search_multi: '/search/multi',
		    person_id: '/person/{id}',
		    person_credits: '/person/{id}/combined_credits'
	    }
	}


	// ---
    // PRIVATE METHODS.
    // ---

    /**
	 * @function handleError
	 * @type {private}
	 * Returns error response data from http request
	 * @param {obj} response
	 * @return {obj}
	 */
    function handleError(response) {

        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
            ) {

            return( $q.reject( "An unknown error occurred." ) );

        }

        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }

    /**
	 * @function handleSuccess
	 * @type {private}
	 * Returns response data from http request
	 * @param {obj} response
	 * @param {obj} response.data
	 * @return {obj}
	 */
    function handleSuccess( response ) {
        return( response.data );
    }


    // ---
    // PUBLIC METHODS.
    // ---

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

    /**
	 * @function getMoviesList
	 * @type {public}
	 * @description
	 * Requests list of movies by different data types like 
	 * average rating, number of votes, genres and certifications.
	 * @param {obj} params
	 * @param {obj} params.genre_id
	 * @return {function} [Returns a promise]
	 */
    function getMoviesList (params){
    	var requestParams = params;
    	requestParams.page = '1'; // change page number to get next results
 		requestParams.api_key = api.api_key;
 		console.log('requestParams', requestParams);

    	var request = $http({
			method: 'get',
			url: api.base_url + api.path.discover_movies,
			params: requestParams
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
    }


    /**
	 * @function getGenreMoviesList
	 * @type {public}
	 * @description
	 * Requests list of movies by genre id
	 * @param {obj} params
	 * @param {obj} params.genre_id
	 * @return {function} [Returns a promise]
	 */
    function getGenreMoviesList (params){
    	var api_path = api.path.genre_id_movies.replace('{id}', params.genre_id);

    	var request = $http({
			method: 'get',
			url: api.base_url + api_path,
			params: {
				page: '1', // change page number to get next results
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
    }

    /**
	 * @function getGenresList
	 * @type {public}
	 * @description
	 * Requests list of movies genres
	 * @return {function} [Returns a promise]
	 */
	function getGenresList (){
		var request = $http({
			method: 'get',
			url: api.base_url + api.path.genre_movie_list,
			params: {
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
	}

	/**
	 * @function getGenresList
	 * @type {public}
	 * @description
	 * Requests list of movies genres
	 * @return {function} [Returns a promise]
	 */
	function getApiConfig (){
		var request = $http({
			method: 'get',
			url: api.base_url + api.path.configuration,
			params: {
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
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

 	/**
	 * @function getMovieInformation
	 * @type {public}
	 * @description
	 * Requests data of specific movie by id
	 * @return {function} [Returns a promise]
	 */
	function getMovieInformation (movie_id){
		var api_path = api.path.movie_id.replace('{id}', movie_id);

		var request = $http({
			method: 'get',
			url: api.base_url + api_path,
			params: {
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
	}

 	/**
	 * @function getPersonInformation
	 * @type {public}
	 * @description
	 * Requests biography of specific actor / person
	 * @return {function} [Returns a promise]
	 */
	function getPersonInformation (person_id){
		var api_path = api.path.person_id.replace('{id}', person_id);

		var request = $http({
			method: 'get',
			url: api.base_url + api_path,
			params: {
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
	}

	/**
	 * @function getPersonCredits
	 * @type {public}
	 * @description
	 * Requests movies / tv shows of specific actor / person
	 * @return {function} [Returns a promise]
	 */
	function getPersonCredits (person_id){
		var api_path = api.path.person_credits.replace('{id}', person_id);

		var request = $http({
			method: 'get',
			cache: true,
			url: api.base_url + api_path,
			params: {
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
	}

 	/**
	 * @function searchMulti
	 * @type {public}
	 * @description
	 * Search for everything 
	 * @return {function} [Returns a promise]
	 */
	function searchMulti (string){
		var encodedString = encodeURI(string);

		var request = $http({
			method: 'get',
			url: api.base_url + api.path.search_multi,
			params: {
				query: encodedString,
				api_key: api.api_key
			}
		});

		var promise = request.then(handleSuccess, handleError);

		return promise;
	}

	// Return public
	return {
		getGenresList: getGenresList,
		getMoviesList: getMoviesList,
		getGenreMoviesList: getGenreMoviesList,
		getApiConfig: getApiConfig,
		getGenreData: getGenreData,
		getMovieInformation: getMovieInformation,
		getPersonCredits: getPersonCredits,
		getPersonInformation: getPersonInformation,
		storeApiConfigData: storeApiConfigData,
		storeGenresData: storeGenresData,
		searchMulti: searchMulti
	}
 }]);
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
 		var regExp = /search/g
 		var savePath = (regExp.test(path)) ? '/' : path;
 		console.log('saving previous page: ', savePath);
 		localStorageService.add('previousPage', savePath);
 	}

	// Return public
	return {
		getCurrentPage: getCurrentPage,
		getPreviousPage: getPreviousPage,
		saveCurrentPage: saveCurrentPage,
		savePreviousPage: savePreviousPage
	}
 }]);
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.factory:utilsService
 * @description
 * # utilsService
 * Factory of the moviesApp
 */

 app.factory('utilsService', function (){
 	
 	/**
 	 * @params.array
 	 * @params.num
 	 */
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
        templateUrl: 'views/directives/genres-thumb-list.html',
        controller: 'GenresListCtrl'
    };
});
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:featuredMovie
 * @description
 * # featuredMovie
 * Directive of the moviesApp
 */
app.directive('featuredMovie', function(){
    var directiveCtrl = function ($scope, $routeParams, apiService) {
        var params = {};

        if($scope.localParams === 'true') {
            params.with_genres = ($scope.genreId) ? $scope.genreId : null;
        } else {
            params = $routeParams;
        }

        /**
         * Get Api Configuration
         */
        apiService.storeApiConfigData().then(function (apiConfig){
            $scope.images_base_url = apiConfig.images.base_url;
        });

        /**
         * Get movie genre
         */
        apiService.getGenreData(params.with_genres).then(function (genre){
            $scope.genre_name = genre.name;
        });

        /**
         * Get the movies list
         */
        apiService.getMoviesList(params).then(function (data) {
            var random = Math.floor((Math.random() * data.results.length) + 1);
            $scope.featured_movie = data.results[random];
        });
    }

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			localParams: '@localParams',
	      	backdropSize: '@backdropSize',
	      	genreId: '@genreId'
	    },
        templateUrl: 'views/directives/featured-movie.html',
        controller: ['$scope', '$routeParams', 'apiService', directiveCtrl]
    };
});
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:movieGrid
 * @description
 * # movieGrid
 * Directive of the moviesApp
 */
app.directive('movieGrid', function(){

	var directiveCtrl = function ($scope, $routeParams, apiService, utilsService) {
		var params = {};

		if($scope.localParams === 'true') {
			params.with_genres = ($scope.genreId) ? $scope.genreId : null;
			params.sort_by = ($scope.sortBy) ? $scope.sortBy : null;
		} else {
			params = $routeParams;
		}

        console.log($scope.mikeInfo);

		/**
         * Get Api Configuration
         */
        apiService.storeApiConfigData().then(function (apiConfig){
            $scope.images_base_url = apiConfig.images.base_url;
        });

        /**
         * Get movie genre
         */
        apiService.getGenreData(params.with_genres).then(function (genre){

            $scope.genre_name = genre.name;
        });

        /**
         * Get the movies list
         */
        apiService.getMoviesList(params).then(function (data) {
            var itemsPerGroup = parseInt($scope.groupItems);

			// order the results in groups
			var orderedResults = utilsService.groupArray({
				num: itemsPerGroup,
				array: data.results
			});

			$scope.moviesList = orderedResults;
            console.log(orderedResults);
        });
	}

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			localParams: '@localParams',
	      	posterSize: '@posterSize',
	      	groupItems: '@groupItems',
	      	genreId: '@genreId',
	      	sortBy: '@',
            showInfo: '@'
	    },
        templateUrl: 'views/directives/movie-grid.html',
        controller: ['$scope', '$routeParams', 'apiService', 'utilsService', directiveCtrl]
    };
});
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:genresMenu
 * @description
 * # genresMenu
 * Directive of the moviesApp
 */
app.directive('mapFontSize', function ($window, $document){

	function changeFontSize (element){
    	var body = $document[0].body;
    	var currentWidth = body.clientWidth;

    	var styles = {
    		'font-size': currentWidth / 21.16
    	}

    	element.css(styles);

	}

    return function ($scope, element, attr){
    	var win = angular.element($window);
    	var doc = angular.element(document);

    	doc.ready(function(){
    		changeFontSize(element);
    	});
    	

    	win.bind('resize', function(){
    		changeFontSize(element);
    	});
    };
});
'use strict';

/**
 * @ngdoc function
 * @name moviesApp.directive:genresMenu
 * @description
 * # genresMenu
 * Directive of the moviesApp
 */
app.directive('searchBox', function (){

	var lastSearch;
	var previousPage; 

	function directiveCtrl ($scope, $routeParams, $window, $location, mainService, apiService, utilsService){
		
		$scope.search = function() {
			if($scope.searchInput !== lastSearch) {
				if($scope.searchInput === '') {
					// get previous page stored in session
					previousPage = mainService.getPreviousPage();
					$location.path(previousPage);
				} else {
					// change the current URL with the values in the input
					// The search request will be done by the search view controller
					lastSearch = $scope.searchInput;
					$location.path('/search/'+$scope.searchInput);
				}
			} 
			
		}
	}


	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/search-box.html',
		controller: ['$scope', '$routeParams', '$window', '$location', 'mainService', 'apiService', 'utilsService', directiveCtrl]
	}
});
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