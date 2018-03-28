'use strict';


/**
* Contains the sequence of modules to be synthetize
*/
angular.module('MaryTTSHTMLFrontEnd')
.factory('moduleSequenceService', function ($rootScope) {
	var sServObj = {};

	sServObj.input = "Input";
	sServObj.output = "Output";
	sServObj.moduleSequence = []; //Do a json

	sServObj.addModule = function(){
		if($("#moduleList").val()){
			sServObj.moduleSequence.push($("#moduleList").val());
		}
	};

	sServObj.removeModule = function(i){
		sServObj.moduleSequence.splice(i, 1);
	};

	sServObj.resetModule = function(){
		sServObj.input = "";
		sServObj.output = "";
		sServObj.moduleSequence = [];	
	};

	sServObj.setModuleSequence = function(newSequence){
		sServObj.moduleSequence = newSequence;
	};

	sServObj.setInput = function(newInput){
		sServObj.input = newInput;
	};

	sServObj.setOutput = function(newOutput){
		sServObj.output = newOutput;
	};


	return sServObj;
});
