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

	    // List the modules
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

	    // List the serializers
	    $.post(sServObj.getBaseURL() + "listAvailableSerializers/",
		   {},
		   function(result) {

		       // Add category

		       $("#categoriesInput").append($('<option>', {
			   value: "serializer",
			   text: "serializer",
			   selected: false
		       }));

		       var build_list = [];
		       for (var k in result) {
			   build_list.push(result[k]);
		       }

		       sServObj.map_modules["serializer"] = {};
		       sServObj.map_modules["serializer"]["serializer"] = build_list;
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

	    var category = $("#categoriesInput option:selected").text();
	    $("#configurationInput").children().remove();

	    // Add modules from the first category
	    var i = 0;
	    for (var m in sServObj.map_modules[category]) {
		$("#configurationInput").append($('<option>', {
		    value: m,
		    text: m,
		    selected: i == 0
		}));
		i=1;
	    }

	    // Get description
	    sServObj.listModulesFromCurrentCategoryAndCurrentConf();
	};


	sServObj.listModulesFromCurrentCategoryAndCurrentConf = function() {
	    if($("#categoriesInput").val()==="serializer"){
    		$("#moduleButtonDiv").hide();
    		$("#inputOutputButtonDiv").show(); //show input/output buttons
	    } else {
    		$("#moduleButtonDiv").show();
    		$("#inputOutputButtonDiv").hide(); //show add module buttons
	    }

	    var category = $("#categoriesInput option:selected").text();
	    var conf = $("#configurationInput option:selected").text();
	    $("#moduleList").children().remove();

	    // Add modules from the first category
	    for (var m in sServObj.map_modules[category][conf]) {
		$("#moduleList").append($('<option>', {
		    value: sServObj.map_modules[category][conf][m],
		    text: sServObj.map_modules[category][conf][m],
		    selected: m == 0
		}));
	    }

	    // Get description
	    sServObj.getCurrentModuleDescription();
	};

	sServObj.getCurrentModuleDescription = function() {

	    // FIXME: no description support for serializer for now
	    if($("#categoriesInput").val()==="serializer"){
		$("#descriptionInput").val("no description");
		return;
	    }

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


			// FIXME:
			if (sServObj.configuration["marytts.runutils.Request"]["output_serializer"] === "marytts.io.serializer.TextGridSerializer") {
			    // FIXME: hardcoded
			    var dur = 71;
			    var sr = 48000;
			    sServObj.loadStaticBuffer(dur*sr, sr);
			    AnnotService.setAnnotFromTextGrid(result_content, sr, dur*sr);
			} else {
			    // Parse the result
			    var json_result;
			    try {
				json_result = JSON.parse(result_content);
				if (json_result == null) {
				    return;
				}
			    } catch (err) {
				return;
			    }

			    if ("audio" in json_result) {
				//converts BASE64 to arrayBuffer
				var tampon = sServObj.BASE64ToArrayBuffer(json_result["audio"]);

				//converts arrayBuffer to audioBuffer, which "starts" the app
				Wavparserservice.parseWavAudioBuf(tampon).then(function (audioBuffer) {
				    sServObj.setAudioBuffer(audioBuffer);
				}, function (errMess) {
				    console.log("Erreur " + errMess);
				});

				// FIXME: dealing with the texgrid
				if ("textgrid" in json_result) {
				    // FI
				    // Set the textgrid
				    AnnotService.setAnnotFromTextGrid(json_result["textgrid"],
								      sServObj.audioBuffer["samplerate"],
								      sServObj.audioBuffer["length"]);
				}

				// Enable buttons
				$('#pause').prop('disabled', false);
				$('#play').prop('disabled', false);
				$('#save').prop('disabled', false);

				// Reset pause button state
				$('#pause').attr('data-state', 'off');
				$('#pause-text').text('Pause');
				$('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');
			    }
			}

		    }

		    if("log" in result){
			//FIXME : no logs for now
			$("#log").val(result["log"]);
		    }
		});
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
	};

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
	};

	return sServObj;
    });
