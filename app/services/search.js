'use strict';

/**
 * @ngdoc function
 * @name moviesApp.factory:SearchFactory
 * @description
 * # SearchFactory
 * Factory of the moviesApp
 */

 app.factory('SearchFactory', function($http, $q){
 	var service = {};
 	var r = {
	 		url: {
	 			host: 'http://api.ean.com/',
		 		path: 'ean-services/rs/hotel/',
		 		version: 'v3/',
		 		method: 'list'
	 		},
	 		auth: {
	 			secret: 'anBbX62c',
		 		apiKey: 'j4r6b8v7vt3vy3vyxek4muh2',
		 		cid: '55505'
	 		},
	 		defaults: {
	 			locale: 'en_US',
		 		numberOfResults: 10,
		 		minorRev: 5,
		 		_type: 'json'
	 		}
	 	};

 	var formData = {};

 	var makeUrl = function() {
 		var url = r.url.host + r.url.path + r.url.version + r.url.method;

 		var signature = createSignature();
 		var query = '?sig=' + signature;
 		query += '&' + $.param(r.auth);
 		query += '&' + $.param(r.defaults); 
 		query += '&' + $.param(formData); 

 		return query;
 	}

 	var createSignature = function() {
 		var timestamp = new Date().getTime();
	 	return md5(r.apiKey + r.secret + timestamp);
 	}

 });