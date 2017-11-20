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
			//read .wav as arrayBuffer
			reader.readAsArrayBuffer(file);
			reader.onloadend = function (evt) {
				if (evt.target.readyState === FileReader.DONE) {
					if (browserDetector.isBrowser.Firefox()) {
						res = evt.target.result;
					} else {
						res = evt.currentTarget.result;
					}
					//converts arrayBuffer to BASE64
					var tampon = sServObj.ArrayBufferToBASE64(res);
					//converts BASE64 to arrayBuffer
					tampon = sServObj.BASE64ToArrayBuffer(tampon);
					//converts arrayBuffer to audioBuffer, which "starts" the app
					Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
						sServObj.setAudioBuffer(audioBuffer);
					}, function (errMess){
						console.log("Erreur " + errMess);
					});
				}
			};
		};

		/**
		* Converts ArrayBuffer to base64
		*/

		sServObj.ArrayBufferToBASE64 = function(buffer){
			var binary = '';
			var bytes = new Uint8Array(buffer);
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			var res = window.btoa(binary);
			console.log(res);
			return res;
		}

		/**
		* Converts base64 to ArrayBuffer
		*/
		sServObj.BASE64ToArrayBuffer = function (stringBase64) {
			var binaryString = window.atob(stringBase64);
			var len = binaryString.length;
			var bytes = new Uint8Array(len);
			for (var i = 0; i < len; i++) {
				var ascii = binaryString.charCodeAt(i);
				bytes[i] = ascii;
			}
			console.log(bytes.buffer);
			return bytes.buffer;
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
