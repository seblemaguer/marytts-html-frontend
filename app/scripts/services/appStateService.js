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

		//minimum and maximum length of the signal (usually 0 and audioBuffer.lenght)
		sServObj.startMin = undefined;
		sServObj.stopMax = undefined;

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

		return sServObj;
});
