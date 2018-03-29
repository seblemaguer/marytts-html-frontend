'use strict';

angular.module('MaryTTSHTMLFrontEnd')
.service('MaryService', function MaryService($rootScope,Wavparserservice,browserDetector,AnnotService,appStateService,moduleSequenceService) {
	// shared service object
	var sServObj = {};
	sServObj.audioBuffer = undefined;
	sServObj.configuration = {
    "marytts.runutils.Request": {
	"input_serializer": "marytts.io.serializer.TextSerializer",
        "output_serializer": "marytts.io.serializer.TextGridSerializer",
	"module_sequence": [
	    "marytts.language.en.JTokenizer",
            "marytts.language.en.Preprocess",
            "marytts.language.en.OpenNLPPosTagger",
            "marytts.language.en.USJPhonemiser",
            "marytts.modules.dummies.DurationPrediction"
	]
    }
};

	sServObj.MARY_HOST = "localhost";
	sServObj.MARY_PORT = "59125";
    sServObj.map_modules = null;

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sServObj.staticBuffer = null;

    sServObj.listModules = function() {
    	$("#inputOutputButtonDiv").hide(); //hide the buttons to change input/output
	$.post(sServObj.getBaseURL() + "listAvailableModulesByCategories/",
	       {},
	       function(result) {
		   sServObj.map_modules = result;

		   // Empty select
		   $("#categoriesInput").children().remove();

		   // Add category
		   var def_cat = null;
		   for (var k in sServObj.map_modules) {
		       if (def_cat == null) {
			   def_cat = k;
		       }

		       $("#categoriesInput").append($('<option>', {
			   value: k,
			   text: k,
			   selected: def_cat == k
		       }));
		   }

		   sServObj.listModulesFromCurrentCategory();


	       });
    };


    sServObj.listModulesFromCurrentCategory = function() {
    if($("#categoriesInput").val()==="serializer"){
    	$("#moduleButtonDiv").hide();
    	$("#inputOutputButtonDiv").show(); //show input/output buttons
    } else {
    	$("#moduleButtonDiv").show();
    	$("#inputOutputButtonDiv").hide(); //show add module buttons
    }
	var category = $("#categoriesInput option:selected").text()
	$("#moduleList").children().remove();
	// Add modules from the first category
	for (var m in sServObj.map_modules[category]) {
	    $("#moduleList").append($('<option>', {
		value: sServObj.map_modules[category][m],
		text: sServObj.map_modules[category][m],
		selected: m == 0
	    }));
	}

	// Get description
	sServObj.getCurrentModuleDescription();
    };

    sServObj.getCurrentModuleDescription = function() {
	var module = $("#moduleList option:selected").text();
	$.post(sServObj.getBaseURL() + "getDescription/",
	       {"module": module},
	       function(result) {
		   $("#descriptionInput").val(result);
	       });
    };


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

		//If an exception occurs
		if("exception" in result && result["exception"]!=null){
			$("#server_results").collapse('show');
		    $("#text-result").val(sServObj.exception_string(result["exception"]));
		    $("#server_results").removeClass('border-primary border-success border-danger').addClass('border-danger');


		} else {
		    $("#audio_results").collapse('show');
		    $("#server_results").removeClass('border-primary border-success border-danger').addClass('border-success');
		    // FIXME: hardcoded
		    var dur = 71;
		    var sr = 48000;
		    sServObj.loadStaticBuffer(dur*sr, sr);
		    AnnotService.setAnnotFromTextGrid(result_content, sr, dur*sr);


		    // // FIXME: reintegrate that
		    // var json_result = JSON.parse(result_content);
		    // console.log(json_result);
		    // if (json_result == null) {
		    // 	return;
		    // }
		    // if ("audio" in json_result) {
		    // 	$("#text-result").val(json_result["audio"]);

		    // 	//converts BASE64 to arrayBuffer
		    // 	var tampon = sServObj.BASE64ToArrayBuffer(json_result["audio"]);

		    // 	//converts arrayBuffer to audioBuffer, which "starts" the app
		    // 	Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
		    // 	    sServObj.setAudioBuffer(audioBuffer);
		    // 	}, function (errMess){
		    // 	    console.log("Erreur " + errMess);
		    // 	});

		    // 	// wavesurfer.loadBlob(blob_wav);
		    // 	$('#pause').prop('disabled', false);
		    // 	$('#play').prop('disabled', false);
		    // 	$('#save').prop('disabled', false);

		    // 	//reset pause button state
		    // 	$('#pause').attr('data-state', 'off');
		    // 	$('#pause-text').text('Pause');
		    // 	$('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');


		    // } else if (("sequences" in json_result) && ("AUDIO" in json_result["sequences"])) {

		    // 	// Extract the wave

		    // 	//converts BASE64 to arrayBuffer
		    // 	var tampon = sServObj.BASE64ToArrayBuffer(json_result["sequences"]["AUDIO"][0]["ais"]);

		    // 	//converts arrayBuffer to audioBuffer, which "starts" the app
		    // 	Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
		    // 	    sServObj.setAudioBuffer(audioBuffer);
		    // 	}, function (errMess){
		    // 	    console.log("Erreur " + errMess);
		    // 	});

		    // 	// enable buttons
		    // 	$('#pause').prop('disabled', false);
		    // 	$('#play').prop('disabled', false);
		    // 	$('#save').prop('disabled', false);

		    // 	//reset pause button state
		    // 	$('#pause').attr('data-state', 'off');
		    // 	$('#pause-text').text('Pause');
		    // 	$('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');

		    // 	//scroll down to bottom
		    // 	$("html, body").animate({scrollTop: $(document).height()}, 1000);
		    // } else {
		    // 	$("#audio_results_area").prop("display", "none");
		    // } //else if textgrid
		    // /*{
		    //   sServObj.createBuffer();
		    //   var json = "";
		    //   }*/
		}

		if("log" in result){
		    //FIXME : no logs for now
		    $("#log").val(result["log"]);
		}
	    }
		  );
	}

    };

    //Function to create expection trace
    sServObj.exception_string = function(result) {
	var str = result.message;
	for(var num in result.stackTrace){
	    str += "\n\t" + sServObj.stacktrace_string(result.stackTrace[num]);
	}
	if(result.cause == null) {
	    return str;
	} else {
	    return str + "\n"+ sServObj.exception_string(result.cause);
	}
    }

    sServObj.stacktrace_string = function(stacktrace){
	return stacktrace.className+"."+stacktrace.methodName+" ("+stacktrace.fileName+":"+stacktrace.lineNumber+") ";
    }

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
	appStateService.setMinMax(0,sServObj.audioBuffer.length);
	appStateService.setStartStop(0,sServObj.audioBuffer.length);
	//Something has changed, so we call $apply manually
	//$rootScope.$apply();
    };


    /**
     * Returns the audioBuffer
     */
    sServObj.getAudioBuffer = function(){
	return sServObj.audioBuffer;
    };

    /**
     *	Create a new buffer (empty), used to trick when printing levels without real audiobuffer -- See testlevel in main controller
     */
    sServObj.loadStaticBuffer= function(dur_frame, sr){
	sServObj.staticBuffer = audioCtx.createBuffer(1, dur_frame, sr);
	sServObj.setAudioBuffer(sServObj.staticBuffer);
    }

    sServObj.setConfiguration = function(newConfig){
	if("marytts.runutils.Request" in newConfig){
	    if("module_sequence" in newConfig["marytts.runutils.Request"]){
		moduleSequenceService.setModuleSequence(newConfig["marytts.runutils.Request"]["module_sequence"]);
		sServObj.configuration = newConfig;
	    }
	    if("input_serializer" in newConfig["marytts.runutils.Request"]){
		moduleSequenceService.setInput(newConfig["marytts.runutils.Request"]["input_serializer"]);
	    }
	    if("output_serializer" in newConfig["marytts.runutils.Request"]){
		moduleSequenceService.setOutput(newConfig["marytts.runutils.Request"]["output_serializer"]);
	    }
	}


    }

    return sServObj;
});
