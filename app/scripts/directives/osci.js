'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.directive('osci', function (Drawhelperservice, fileService) {
		return {
			templateUrl: 'views/osci.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
				var canvas = document.getElementById("osci");
				console.log(canvas);
				scope.fs = fileService;
				//get the canvas and draw the buffer when available
				scope.$watch('fs.getAudioBuffer()', function(newValue, oldValue){
					console.log("Valeur " + newValue);
					if(newValue!==oldValue) {
						console.log("Je suis dans le watch");
						Drawhelperservice.freshRedrawDrawOsciOnCanvas(canvas, 0, fileService.audioBuffer.length, true);
					}
				}, true);
			}
		};
	});
