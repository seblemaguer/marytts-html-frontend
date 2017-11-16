'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('audiocontrols', function (Drawhelperservice, fileService) {
		return {
			templateUrl: 'views/audiocontrols.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
			    // var canvas = document.getElementById("audiocontrols");
			}
		};
	});
