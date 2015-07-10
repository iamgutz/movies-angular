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