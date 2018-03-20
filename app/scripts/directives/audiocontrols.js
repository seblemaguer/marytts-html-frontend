'use strict';

angular.module('MaryTTSHTMLFrontEnd')
    .directive('audiocontrols', function (MaryService, playService, appStateService,downloadService) {
		return {
			templateUrl: 'views/audiocontrols.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope,element){

				scope.zoomIn = function(){
					console.log("zoomIn");
					//if start / stop !== undefined
					//then change them
				};

				scope.zoomOut = function(){
					console.log("zoomOut");
					//if start / stop !== undefined
					//change them
				};

				scope.toLeft = function(){
					console.log("toLeft");
					//if start / stop !== undefined
					//change them
				};

				scope.toRight = function(){
					console.log("toRight");
					//if start / stop !== undefined
					//change them
				};

				scope.play = function(){
					//if audioBuffer !== undefined
					//play it
					if(MaryService.getAudioBuffer()!==undefined){
						playService.playFromTo(0, MaryService.getAudioBuffer().length);
					}
				};

				scope.pauseResume = function(){
					if(MaryService.getAudioBuffer()!==undefined){
						playService.pauseResume();
					}
				}

				scope.download = function(){
					if(MaryService.getAudioBuffer()){
						var wavBuffer = downloadService.audioBufferToWav(MaryService.getAudioBuffer());
						var data = new Blob([wavBuffer], { type: 'audio/wav' });
    					FileSaver.saveAs(data, 'result.wav');
					}
				}
			}
		};
	});
