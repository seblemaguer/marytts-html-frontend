'use strict';

/**
 * @ngdoc function
 * @name MaryTTSHTMLFrontEnd.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MaryTTSHTMLFrontEnd')
    .controller('configurationCtrl',
		function ($scope, $rootScope, MaryService) {

		    // Save the mary service
  		    $scope.ms = MaryService;

		    // Ace
		    $scope.editor = ace.edit("configuration");
		    $scope.configuration_code = JSON.stringify($scope.ms.configuration, null, 4);


		    // Runs when editor loads
		    $scope.aceChanged = function(ed){
			try {
			    var json = JSON.parse($scope.configuration_code);
			    $scope.ms.setConfiguration(json);
			} catch (err) {
			    //console.error(err);
			}

		    };
		});
