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

	// Link some services
	$scope.mss.setModuleSequence($scope.fs.configuration["marytts.runutils.Request"]["module_sequence"]);
	$scope.mss.setInput($scope.fs.configuration["marytts.runutils.Request"]["input_serializer"]);
	$scope.mss.setOutput($scope.fs.configuration["marytts.runutils.Request"]["output_serializer"]);

	$scope.$watch('fs.getAudioBuffer()', function(newVal,oldVal){
	    if(newVal!==oldVal){
	        $scope.levels = [];
	    }
	});

	$scope.$watch('mss.moduleSequence', function(newVal,oldVal){
	    if(newVal!==oldVal){
	        $scope.fs.configuration["marytts.runutils.Request"]["module_sequence"] = $scope.mss.moduleSequence;
		var buffer = JSON.stringify($scope.fs.configuration, null, 4);

		if (buffer !== $scope.configuration_editor.getValue()) {
		    var editor = ace.edit("configuration");
	            editor.setValue(buffer);
		}
	    }
	},true);

	$scope.$watch('mss.input', function(newVal,oldVal){
	    if(newVal!==oldVal){
	        $scope.fs.configuration["marytts.runutils.Request"]["input_serializer"] = $scope.mss.input;
		var buffer = JSON.stringify($scope.fs.configuration, null, 4);

		if (buffer !== $scope.configuration_editor.getValue()) {
		    var editor = ace.edit("configuration");
	            editor.setValue(buffer);
		}
	    }
	});

	$scope.$watch('mss.output', function(newVal,oldVal){
	    if(newVal!==oldVal){
	        $scope.fs.configuration["marytts.runutils.Request"]["output_serializer"] = $scope.mss.output;
		var buffer = JSON.stringify($scope.fs.configuration, null, 4);


		if (buffer !== $scope.configuration_editor.getValue()) {
		    var editor = ace.edit("configuration");
	            editor.setValue(buffer);
		}
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
