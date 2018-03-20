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

  		$scope.fs = MaryService;

  		$scope.mss = moduleSequenceService;

  		// $scope.$watch("fs.audioBuffer", function(newVal){
  		// 	console.log("Valeur " + newVal);
  		// });

  		$scope.as = AnnotService;
	    $scope.bs = MaryService;

	    $scope.$watch('bs.getAudioBuffer()', function(newVal,oldVal){
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
