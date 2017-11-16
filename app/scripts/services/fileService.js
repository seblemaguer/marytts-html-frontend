'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.service('fileService', function fileService($rootScope,Wavparserservice,browserDetector) {
		// shared service object
		var sServObj = {};
		sServObj.file = undefined;
		sServObj.audioBuffer = null;

		/**
		* return false if there is no file yet
		*/
		sServObj.hasFile = function(){
			return (sServObj.file!==undefined);
		};

		/**
		* change the file
		*/
		sServObj.changeFile = function(newFile){
			sServObj.file = newFile;
			sServObj.convertData(sServObj.file);
		};

		/**
		* Converts file to an audiobuffer
		*/
		sServObj.convertData = function(file){
			var reader = new FileReader();
			var res;
			reader.readAsArrayBuffer(file);
			reader.onloadend = function (evt) {
				if (evt.target.readyState === FileReader.DONE) {
					if (browserDetector.isBrowser.Firefox()) {
						res = evt.target.result;
					} else {
						res = evt.currentTarget.result;
					}
					Wavparserservice.parseWavAudioBuf(res).then(function (audioBuffer) {
						console.log("Audio Buffer : "+audioBuffer);
						sServObj.setAudioBuffer(audioBuffer);
					}, function (errMess){
						console.log("Erreur " + errMess);
					});
				}
			};
		};

		/**
		* Returns the file
		*/
		sServObj.getFile = function(){
			return sServObj.file;
		};

		/**
		* Sets the audioBuffer
		*/
		sServObj.setAudioBuffer = function(newBuffer){
			sServObj.audioBuffer = newBuffer;
			//Something has changed, so we call $apply manually
			$rootScope.$apply();
		};


		/**
		* Returns the audioBuffer
		*/
		sServObj.getAudioBuffer = function(){
			return sServObj.audioBuffer;
		};

		return sServObj;
	});
