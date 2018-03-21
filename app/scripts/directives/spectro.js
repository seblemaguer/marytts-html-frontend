'use strict';


/**
* Add a spectrogramm of the signal of the audio buffer
*/
angular.module('MaryTTSHTMLFrontEnd')
	.directive('spectro', function (Drawhelperservice, MaryService, mathHelperService, appStateService, mouseService) {
		return {
			templateUrl: 'views/spectro.html',
			restrict: 'E',
			replace: true,
			scope: {},
			link: function postLink(scope, element) {
				scope.bs = MaryService;
				scope.ass = appStateService;
				scope.dhs = Drawhelperservice;
				scope.ms = mouseService;
				// select the needed DOM elements from the template
				scope.canvas = document.getElementById("spectro");
				scope.canvas2 = document.getElementById("spectro2");
				scope.context = scope.canvas.getContext('2d');

				// FFT default vars
				// default alpha for Window Function
				scope.alpha = 0.16;
				scope.devicePixelRatio = window.devicePixelRatio || 1;

				// Spectro Worker
				scope.primeWorker = new SpectroDrawingWorker();

				//start and stop of the signal
				scope.start = undefined;
				scope.stop = undefined;

				///////////////
				// watches

				//watching when the audio signal is available
				scope.$watch('bs.getAudioBuffer()', function(newValue, oldValue){
					if ((newValue!==undefined)&&(oldValue!==newValue)) {
						scope.start = 0;
						scope.stop = scope.bs.getAudioBuffer().length;
						scope.redraw();
					}
				});

				//watching when zooming or shifting
				scope.$watch('ass.getStart()',function(newValue, oldValue){
					if ((newValue!==undefined)&&(oldValue!==newValue)) {
						scope.start = scope.ass.getStart();
						scope.stop = scope.ass.getStop();
						scope.redraw();
						Drawhelperservice.drawSelectedArea(scope.canvas2);
					}
				});

				scope.$watch('ass.getStop()',function(newValue, oldValue){
					if ((newValue!==undefined)&&(oldValue!==newValue)) {
						scope.start = scope.ass.getStart();
						scope.stop = scope.ass.getStop();
						scope.redraw();
						Drawhelperservice.drawSelectedArea(scope.canvas2);
					}
				});

				//Mouse bind -- Draw selected area
				element.bind("mousedown", function(event){
					scope.ms.setSelectedAreaS( scope.ass.getStart() + scope.ass.getX(event) * scope.ass.getSamplesPerPixelVal(event));

				});

				element.bind("mouseup", function(event){
					scope.ms.setSelectedAreaE( scope.ass.getStart() + scope.ass.getX(event) * scope.ass.getSamplesPerPixelVal(event));
					
				});

				//mousemove for red drawing line
				element.bind("mousemove", function(event){
					//draw red line at the position of the mouse - update the mouseX and mouseY from mouseService
					if(event.buttons>0){ //if mouse button was clicked
						scope.ms.setSelectedAreaE( scope.ass.getStart() + scope.ass.getX(event) * scope.ass.getSamplesPerPixelVal(event));
					}
				});


				//Watches for drawing the selected area
				scope.$watch('ms.getSelectedAreaS()', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						Drawhelperservice.drawSelectedArea(scope.canvas2);
					}
				});

				scope.$watch('ms.getSelectedAreaE()', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						Drawhelperservice.drawSelectedArea(scope.canvas2);
					}
				});


				///////////////
				// bindings

				scope.redraw = function () {
					scope.context.clearRect(0, 0, scope.canvas.width, scope.canvas.height);
					//change getChannelData here if multiple channel
					scope.drawSpectro(scope.bs.audioBuffer.getChannelData(0));
				};

				scope.drawSpectro = function (buffer) {
					scope.killSpectroRenderingThread();
					scope.startSpectroRenderingThread(buffer);
				};

				scope.calcSamplesPerPxl = function () {
					return (scope.stop + 1 - scope.start) / scope.canvas.width;
				};


				scope.killSpectroRenderingThread = function () {
					scope.context.fillStyle = "#E7E7E7";
					scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
					// draw current viewport selected
					//scope.dhs.drawCurViewPortSelected(scope.context2, false);
					//fontScaleService.drawUndistortedText(scope.context, 'rendering...', ConfigProviderService.design.font.small.size.slice(0, -2) * 0.75, ConfigProviderService.design.font.small.family, 10, 50, ConfigProviderService.design.color.black, true);
					if (scope.primeWorker !== null) {
						scope.primeWorker.kill();
						scope.primeWorker = null;
					}
				};

				scope.setupEvent = function () {
					var imageData = scope.context.createImageData(scope.canvas.width, scope.canvas.height);
					scope.primeWorker.says(function (event) {
						if (event.status === undefined) {
							if (scope.calcSamplesPerPxl() === event.samplesPerPxl) {
								var tmp = new Uint8ClampedArray(event.img);
								imageData.data.set(tmp);
								scope.context.putImageData(imageData, 0, 0);
							}
						} else {
							console.error('Error rendering spectrogram:', event.status.message);
						}
					});
				};

				scope.startSpectroRenderingThread = function (buffer) {
					if (buffer.length > 0) {
						scope.primeWorker = new SpectroDrawingWorker();
						var parseData = [];
						var fftN = mathHelperService.calcClosestPowerOf2Gt(scope.bs.audioBuffer.sampleRate * 0.01);
						// fftN must be greater than 512 (leads to better resolution of spectrogram)
						if (fftN < 512) {
							fftN = 512;
						}
						// extract relavant data
						parseData = buffer.subarray(scope.start, scope.stop);

						var leftPadding = [];
						var rightPadding = [];

						// check if any zero padding at LEFT edge is necessary
						var windowSizeInSamples = scope.bs.audioBuffer.length;
						if (0 < windowSizeInSamples / 2) {
							//should do something here... currently always padding with zeros!
						}
						else {
							leftPadding = buffer.subarray(0 - windowSizeInSamples / 2, 0);
						}
						// check if zero padding at RIGHT edge is necessary
						if (scope.bs.audioBuffer.length + fftN / 2 - 1 >= scope.bs.audioBuffer.length) {
							//should do something here... currently always padding with zeros!
						}
						else {
							rightPadding = buffer.subarray(scope.bs.audioBuffer.length, scope.bs.audioBuffer.length + fftN / 2 - 1);
						}
						// add padding
						var paddedSamples = new Float32Array(leftPadding.length + parseData.length + rightPadding.length);
						paddedSamples.set(leftPadding);
						paddedSamples.set(parseData, leftPadding.length);
						paddedSamples.set(rightPadding, leftPadding.length + parseData.length);

						/*if (0>= fftN / 2) {
							// pass in half a window extra at the front and a full window extra at the back so everything can be drawn/calculated this also fixes alignment issue
							parseData = buffer.subarray(0 - fftN / 2, scope.bs.audioBuffer.length + fftN);
						} else {
							// tolerate window/2 alignment issue if at beginning of file
							parseData = buffer.subarray(0, scope.bs.audioBuffer.length+fftN);
						}*/	
						scope.setupEvent();
						scope.primeWorker.tell({
							'windowSizeInSecs': 0.01,
							'fftN': fftN,
							'alpha': scope.alpha,
							'upperFreq': 5000,
							'lowerFreq': 0,
							'samplesPerPxl': scope.calcSamplesPerPxl(),
							'window': 5,
							'imgWidth': scope.canvas.width,
							'imgHeight': scope.canvas.height,
							'dynRangeInDB': 70,
							'pixelRatio': scope.devicePixelRatio,
							'sampleRate': scope.bs.audioBuffer.sampleRate,
							'transparency': 255,
							'audioBuffer': paddedSamples,
							'audioBufferChannels': 1,
							'drawHeatMapColors': false,
							'preEmphasisFilterFactor': 0.97,
							'heatMapColorAnchors': [
					            [255, 0, 0],
					            [0, 255, 0],
					            [0, 0, 0]
					        ]
						}, [paddedSamples.buffer]);
					}
				};
			}
		};
	});
