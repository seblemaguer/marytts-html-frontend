'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('textresults', function (Drawhelperservice, MaryService) {
		return {
			templateUrl: 'views/textresults.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
			    // var canvas = document.getElementById("textresults");
			}
		};
	});
