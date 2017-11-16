'use strict';

/**
 * @ngdoc function
 * @name MaryTTSHTMLFrontEnd.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MaryTTSHTMLFrontEnd')
  .controller('MainCtrl', function ($scope,$rootScope, fileService) {

  		$scope.fs = fileService;

  		// $scope.$watch("fs.audioBuffer", function(newVal){
  		// 	console.log("Valeur " + newVal);
  		// });

  });
