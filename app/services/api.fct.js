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
		    discover_movies: '/discover/movie'
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

	// Return public
	return {
		getGenresList: getGenresList,
		getMoviesList: getMoviesList,
		getGenreMoviesList: getGenreMoviesList,
		getApiConfig: getApiConfig,
		getGenreData: getGenreData,
		storeApiConfigData: storeApiConfigData,
		storeGenresData: storeGenresData
	}
 }]);