'use strict';

/**
 * @ngdoc function
 * @name MaryTTSHTMLFrontEnd.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MaryTTSHTMLFrontEnd')
    .controller('runCtrl', function ($scope,$rootScope, MaryService) {
	$scope.process = function() {
            MaryService.process();
	};
  });
