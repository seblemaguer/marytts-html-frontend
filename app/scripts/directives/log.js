'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('log', function (Drawhelperservice, MaryService) {
		return {
			templateUrl: 'views/log.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
			    // var canvas = document.getElementById("inputtext");
			}
		};
	});
