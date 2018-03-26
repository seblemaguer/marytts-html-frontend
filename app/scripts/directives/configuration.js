'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('configuration', function (Drawhelperservice, MaryService) {
		return {
			templateUrl: 'views/configuration.html',
			restrict: 'E',
			replace: true,
			scope: {configuration : '='},
			link: function postLink(scope, element) {
			    // var canvas = document.getElementById("configuration");

			    scope.$watch("configuration",function(newVal,oldVal){
			    	if(oldVal!==newVal){
			    		try{
			    			var config = JSON.parse(newVal);
			    			MaryService.setConfiguration(config);
			    		}catch (error){
			    			//console.log(error);
			    		}
			    	}
			    });
			}
		};
	});
