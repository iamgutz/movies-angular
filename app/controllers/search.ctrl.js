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