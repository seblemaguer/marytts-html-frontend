'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('inputtext', function (Drawhelperservice, fileService) {
		return {
			templateUrl: 'views/inputtext.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
			    // var canvas = document.getElementById("inputtext");
			}
		};
	});
