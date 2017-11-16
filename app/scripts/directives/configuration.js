'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('configuration', function (Drawhelperservice, fileService) {
		return {
			templateUrl: 'views/configuration.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
			    // var canvas = document.getElementById("configuration");
			}
		};
	});
