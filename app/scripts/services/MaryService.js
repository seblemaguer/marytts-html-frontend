'use strict';

angular.module('MaryTTSHTMLFrontEnd')
    .service('MaryService', function MaryService($rootScope,Wavparserservice,browserDetector) {
	// shared service object
	var sServObj = {};
	sServObj.audioBuffer = null;
	sServObj.MARY_HOST = "localhost";
	sServObj.MARY_PORT = "59125";

	sServObj.process = function() {

	    var input_text = $("#text-to-synth").val();
	    var configuration = $("#text-configuration").val();
	    //validate input text
	    if (input_text.length === 0) {
		alert('text needs to be defined !');
	    } else if (configuration.length == 0) {
		alert('configuration needs to be defined');
	    } else {

		$.post(sServObj.getBaseURL() + "process/", {
		    "input": input_text,
		    "configuration": configuration
		}, function(result) {

		    var result_content = result["result"];
		    $("#text-result").val(result_content);

		    var json_result = JSON.parse(result_content);

		    if (json_result == null) {
			return;
		    }
		    if ("audio" in json_result) {
			$("#text-result").val(json_result["audio"]);

			//converts BASE64 to arrayBuffer
			var tampon = sServObj.BASE64ToArrayBuffer(json_result["audio"]);

			//converts arrayBuffer to audioBuffer, which "starts" the app
			Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
			    sServObj.setAudioBuffer(audioBuffer);
			}, function (errMess){
			    console.log("Erreur " + errMess);
			});

			// wavesurfer.loadBlob(blob_wav);
			$('#pause').prop('disabled', false);
			$('#play').prop('disabled', false);
			$('#save').prop('disabled', false);

			//reset pause button state
			$('#pause').attr('data-state', 'off');
			$('#pause-text').text('Pause');
			$('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');

		    } else if (("sequences" in json_result) && ("AUDIO" in json_result["sequences"])) {

			// Extract the wave

			//converts BASE64 to arrayBuffer
			var tampon = sServObj.BASE64ToArrayBuffer(json_result["sequences"]["AUDIO"][0]["ais"]);

			//converts arrayBuffer to audioBuffer, which "starts" the app
			Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
			    sServObj.setAudioBuffer(audioBuffer);
			}, function (errMess){
			    console.log("Erreur " + errMess);
			});

			// enable buttons
			$('#pause').prop('disabled', false);
			$('#play').prop('disabled', false);
			$('#save').prop('disabled', false);

			//reset pause button state
			$('#pause').attr('data-state', 'off');
			$('#pause-text').text('Pause');
			$('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');

			//scroll down to bottom
			$("html, body").animate({scrollTop: $(document).height()}, 1000);
		    } else {
			$("#audio_results_area").prop("display", "none");
		    }
		}
		      );
	    }

	};

	sServObj.getBaseURL = function () {
	    return "http://" + sServObj.MARY_HOST + ":" + sServObj.MARY_PORT + "/";
	};


	/**
	 * Converts file to an audiobuffer
	 */
	sServObj.convertData = function(b64_wav){
	    //converts BASE64 to arrayBuffer
	    var tampon = sServObj.BASE64ToArrayBuffer(b64_wav);
	    //converts arrayBuffer to audioBuffer, which "starts" the app
	    Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
		sServObj.setAudioBuffer(audioBuffer);
	    }, function (errMess){
		console.log("Erreur " + errMess);
	    });
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
	    return bytes.buffer;
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
