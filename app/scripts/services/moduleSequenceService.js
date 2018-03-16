'use strict';


/**
* Contains the sequence of modules to be synthetize
*/
angular.module('MaryTTSHTMLFrontEnd')
.factory('moduleSequenceService', function ($rootScope) {
	var sServObj = {};

	sServObj.input = "Input";
	sServObj.output = "Output";
	sServObj.moduleSequence = [];

	sServObj.addModule = function(){
		if($("#moduleList").val()){
			sServObj.moduleSequence.push($("#moduleList").val());
		}
	}

	sServObj.removeModule = function(i){
		sServObj.moduleSequence.splice(i, 1);
	}

	return sServObj;
});
