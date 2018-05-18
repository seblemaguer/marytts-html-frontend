'use strict';

/**
 * @ngdoc function
 * @name MaryTTSHTMLFrontEnd.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MaryTTSHTMLFrontEnd')
    .controller('ConfigurationCtrl',
		function ($scope,$rootScope,$location, MaryService, moduleSequenceService,AnnotService) {

		    // Set services
  		    $scope.ms = MaryService;
  		    $scope.mss = moduleSequenceService;
  		    $scope.as = AnnotService;

		    // Link some services
		    $scope.mss.setModuleSequence($scope.ms.configuration["marytts.runutils.Request"]["module_sequence"]);
		    $scope.mss.setInput($scope.ms.configuration["marytts.runutils.Request"]["input_serializer"]);
		    $scope.mss.setOutput($scope.ms.configuration["marytts.runutils.Request"]["output_serializer"]);

		    // Ace
		    $scope.configuration_code = JSON.stringify($scope.ms.configuration, null, 4);

		    // Runs when editor loads
		    $scope.aceChanged = function(ed){
			try {
			    var json = JSON.parse($scope.configuration_code);
			    $scope.ms.setConfiguration(json);
			} catch (err) {
			    // console.error(err);
			}
		    };
		    // // Ace
		    // $scope.editor_local = ace.edit("configurationModule");
		    // $scope.configuration_code = JSON.stringify($scope.ms.configuration, null, 4);


		    // // Runs when editor loads
		    // $scope.aceChanged = function(ed){
		    // 	try {
		    // 	    var json = JSON.parse($scope.configuration_code);
		    // 	    $scope.ms.setCurrentModule(json);
		    // 	} catch (err) {
		    // 	    //console.error(err);
		    // 	}

		    // };



		    $scope.$watch('mss.moduleSequence', function(newVal,oldVal){
			if(newVal!==oldVal){
			    $scope.ms.configuration["marytts.runutils.Request"]["module_sequence"] = $scope.mss.moduleSequence;
			    var buffer = JSON.stringify($scope.ms.configuration, null, 4);

			    if (buffer !== $scope.configuration_code) {
				$scope.configuration_code = buffer;
			    }
			}
		    },true);

		    $scope.$watch('mss.input', function(newVal,oldVal){
			if(newVal!==oldVal){
			    $scope.ms.configuration["marytts.runutils.Request"]["input_serializer"] = $scope.mss.input;
			    var buffer = JSON.stringify($scope.ms.configuration, null, 4);

			    if (buffer !== $scope.configuration_editor.getValue()) {
				$scope.configuration_code = buffer;
			    }
			}
		    });

		    $scope.$watch('mss.output', function(newVal,oldVal){
			if(newVal!==oldVal){
			    $scope.ms.configuration["marytts.runutils.Request"]["output_serializer"] = $scope.mss.output;
			    var buffer = JSON.stringify($scope.ms.configuration, null, 4);


			    if (buffer !== $scope.configuration_editor.getValue()) {
				$scope.configuration_code = buffer;
			    }
			}
		    });
		});
