'use strict';

angular.module('MaryTTSHTMLFrontEnd')
    .directive('audiocontrols', function (MaryService, FileSaver, playService, appStateService,downloadService) {
		return {
			templateUrl: 'views/audiocontrols.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope,element){

				scope.bs = MaryService;
				scope.app = appStateService;

				scope.$watch("app.getStart()",function(newVal,oldVal){
					if(newVal!==oldVal){
						$("#shifting_bar").val(newVal);
					}
				});

				scope.zoomIn = function(){
					//if start / stop !== undefined
					//then change them (stop/2)
					if((scope.app.getStart()!==undefined)&&(scope.app.getStop()!==undefined)){
						var distance = scope.app.getStop()-scope.app.getStart();
						var distance2 = distance * 3/4; //zoom of 25%
						scope.app.setStartStop(scope.app.getStart()+(distance-distance2)*0.5,scope.app.getStop()-(distance-distance2)*0.5);
					}
				};

				scope.zoomOut = function(){
					//if start / stop !== undefined
					//change them (start-stop / 2)
					if((scope.app.getStart()!==undefined)&&(scope.app.getStop()!==undefined)){
						var distance = scope.app.getStop()-scope.app.getStart();
						var distance2 = distance * 4/3; //zoom of 25%
						scope.app.setStartStop(scope.app.getStart()-(distance2-distance)*0.5,scope.app.getStop()+(distance2-distance)*0.5);
	
					}
				};

				scope.toLeft = function(){
					//if start / stop !== undefined
					//change them  (start/stop -x if start > min);
					if((scope.app.getStart()!==undefined)&&(scope.app.getStop()!==undefined)){
						var newStartS = scope.app.getStart() - ~~((scope.app.getStop() - scope.app.getStart()) / 4);
						var newEndS = scope.app.getStop() - ~~((scope.app.getStop() - scope.app.getStart()) / 4);
						if(newStartS>0){
							scope.app.setStartStop(newStartS,newEndS);	
						}else{
							scope.app.setStartStop(0,scope.app.getStop()-scope.app.getStart());	
						}

					}

				};

				scope.toRight = function(){
					//if start / stop !== undefined
					//change them (start/stop + x if stop < max)
					if((scope.app.getStart()!==undefined)&&(scope.app.getStop()!==undefined)){
						var newStartS = scope.app.getStart() + ~~((scope.app.getStop() - scope.app.getStart()) / 4);
						var newEndS = scope.app.getStop() + ~~((scope.app.getStop() - scope.app.getStart()) / 4);
						if(newEndS<scope.bs.audioBuffer.length){
							scope.app.setStartStop(newStartS,newEndS);	
						}else{
							scope.app.setStartStop(scope.app.getStart()+(scope.bs.audioBuffer.length-scope.app.getStop()),scope.bs.audioBuffer.length);	//pas bon si déjà au bout
						}
					}
				};		

				scope.shift = function(event) {
					if((scope.app.getStart()!==undefined)&&(scope.app.getStop()!==undefined)){
						var value = parseInt(event.target.value); //value is a string because it's coming from a javascript event
						var step = scope.app.getStop()-scope.app.getStart();
						var end = value+step;
						if(end > scope.app.stopMax){
							scope.app.setStartStop(scope.app.stopMax-step,scope.app.stopMax);
						} else {
							scope.app.setStartStop(value,end);
						}
					}					
				}

				scope.play = function(){
					//if audioBuffer !== undefined
					//play it
					if(scope.bs.getAudioBuffer()!==undefined){
						playService.playFromTo(0,scope.bs.getAudioBuffer().length);
					}
				};

				scope.pauseResume = function(){
					if(scope.bs.getAudioBuffer()!==undefined){
						playService.pauseResume();
					}
				}

				scope.download = function(){
					if(scope.bs.getAudioBuffer()){
						var wavBuffer = audioBufferToWav.audioBufferToWav(scope.bs.getAudioBuffer());
						var data = new Blob([wavBuffer], { type: 'audio/wav' });
    					FileSaver.saveAs(data, 'result.wav');
					}
				}
			}
		};
	});
