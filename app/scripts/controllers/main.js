'use strict';

/**
 * @ngdoc function
 * @name MaryTTSHTMLFrontEnd.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MaryTTSHTMLFrontEnd')
    .controller('MainCtrl', function ($scope,$rootScope,$location, MaryService, moduleSequenceService,AnnotService) {

	// Services
  	$scope.fs = MaryService;
  	$scope.mss = moduleSequenceService;
  	$scope.as = AnnotService;


	$scope.$watch('fs.getAudioBuffer()', function(newVal,oldVal){
	    if(newVal!==oldVal){
	        $scope.levels = [];
	    }
	});


	$scope.$watch('as.getAnnot()', function(newVal,oldVal){
	    if(newVal!==oldVal){
	  	$scope.levels = [];
	  	//Ici ajouter les directives pour les levels - Extraire SEGMENTS et EVENT et les rajouter dans levels
	  	newVal.levels.forEach(function(level){
	  	    if(level.type==="SEGMENT" || level.type==="EVENT"){
	  		$scope.levels.push(level);
	  	    }
	  	});
	    }
	});
    });
