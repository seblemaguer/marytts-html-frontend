'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('spectro', function () {
		return {
			templateUrl: 'views/spectro.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope) {
				//get the canvas and draw the buffer when available
			}
		};
	});
