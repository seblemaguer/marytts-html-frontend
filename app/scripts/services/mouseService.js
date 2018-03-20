'use strict';


/**
* Contains the position and the event of the mouse
*/
angular.module('MaryTTSHTMLFrontEnd')
	.factory('mouseService', function ($rootScope) {
		var sServObj = {};

		sServObj.mouseX = undefined;
		sServObj.mouseY = undefined;

		sServObj.selectedAreaS = undefined;
		sServObj.selectedAreaE = undefined;

		sServObj.getMouseX = function(){
			return sServObj.mouseX;
		}

		sServObj.getMouseY = function(){
			return sServObj.mouseY;
		}

		sServObj.getSelectedAreaS = function(){
			return sServObj.selectedAreaS;
		}		

		sServObj.getSelectedAreaE = function(){
			return sServObj.selectedAreaE;
		}

		sServObj.setSelectedAreaS = function(newValue){
			sServObj.selectedAreaS = newValue;
			$rootScope.$apply();
		}		

		sServObj.setSelectedAreaE = function(newValue){
			sServObj.selectedAreaE = newValue;
			$rootScope.$apply();
		}

		return sServObj;
});