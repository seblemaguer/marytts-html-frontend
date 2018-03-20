'use strict';


/**
* Contains the start and the end of the signal to display
*/
angular.module('MaryTTSHTMLFrontEnd')
	.factory('appStateService', function ($rootScope) {
		var sServObj = {};

		//current start and end of the signal
		sServObj.startSignal = undefined;
		sServObj.stopSignal = undefined;

		//minimum and maximum length of the signal (usually 0 and audioBuffer.length)
		sServObj.startMin = undefined;
		sServObj.stopMax = undefined;

		//mouse variables
		sServObj.movingS = undefined;
		sServObj.movingE = undefined;

		//set the start and the stop of the signal
		sServObj.setStartStop = function(newStart,newStop){
			if(newStart<sServObj.startMin){
				newStart = 0;
			}
			if(newStop>sServObj.stopMax){
				newStop=sServObj.stopMax;
			}
			sServObj.startSignal = newStart;
			sServObj.stopSignal = newStop;
		}

		//set the min and the max
		sServObj.setMinMax = function(newMin,newMax){
			sServObj.startMin = newMin;
			sServObj.stopMax = newMax;
		}

		//get start
		sServObj.getStart = function(){
			return sServObj.startSignal;
		}

		//get stop
		sServObj.getStop = function(){
			return sServObj.stopSignal;
		}

		//get movingS
		sServObj.getMovingS = function(){
			return sServObj.movingS;
		}

		//get movingE
		sServObj.getMovingE = function(){
			return sServObj.movingE;
		}

		/**
		 *
		 */
		sServObj.getX = function (e) {
			return (e.offsetX || e.originalEvent.layerX) * (e.originalEvent.target.width / e.originalEvent.target.clientWidth);
		};

		/**
		 *
		 */
		sServObj.getY = function (e) {
			return (e.offsetY || e.originalEvent.layerY) * (e.originalEvent.target.height / e.originalEvent.target.clientHeight);
		};


		sServObj.getSamplesPerPixelVal = function (event) {
			var start = parseFloat(sServObj.startSignal);
			var end = parseFloat(sServObj.stopSignal);
			return (end - start) / event.originalEvent.target.width;
		};

		sServObj.getSamplesPerPixelValCanvas = function(canvas) {
			var start = parseFloat(sServObj.startSignal);
			var end = parseFloat(sServObj.stopSignal);
			return (end - start) / canvas.width;
		}

		/**
		 * get pixel position in current viewport given the canvas width
		 * @param w is width of canvas
		 * @param s is current sample to convert to pixel value
		 */
		sServObj.getPos = function (w, s) {
			return (w * (s - sServObj.startSignal) / (sServObj.stopSignal - sServObj.startSignal + 1)); // + 1 because of view (displays all samples in view)
		};

		/**
		 * calculate the pixel distance between two samples
		 * @param w is width of canvas
		 */
		sServObj.getSampleDist = function (w) {
			return this.getPos(w, sServObj.startSignal + 1) - this.getPos(w, sServObj.startSignal);
		};




		return sServObj;
});