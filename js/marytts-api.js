'use strict';

/* Mary global information */
var MARY_HOST = "localhost";
var MARY_PORT = "59125";

var current_voice = 0;
var current_language = 0;
var current_region = 0;

var wavesurfer; // Wavesurfer instance
var blob_wav; // Wav buffer
var list_phones; // Phone list for the segmentation part

/**
 * Get base Mary HTTP server url
 * @returns {String} base server URL
 */
function _baseUrl() {
    return "http://" + MARY_HOST + ":" + MARY_PORT + "/";
}


/*************************************************************************************************
 ** Marytts
 *************************************************************************************************/
/**
 * Play the audio file
 * @returns {undefined}
 */
function play() {
    wavesurfer.play();
}

/**
 * Pause the audio file
 * @returns {undefined}
 */
function pause() {
    wavesurfer.playPause();
    //change the icon
    if ($('#pause').attr('data-state') === 'off') {
	$('#pause').attr('data-state', 'on');
	$('#pause-text').text('Play');
	$('#pause-icon').removeClass('glyphicon-pause').addClass('glyphicon-play');
    } else {
	$('#pause').attr('data-state', 'off');
	$('#pause-text').text('Pause');
	$('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');
    }
}

/**
 * Save the audio file
 * @returns {undefined}
 */
function save() {
    saveAs(blob_wav, "synth.wav");
}


/**
 * Get the base64 comparion
 */
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    decode: function(e) {
	var t = "";
	var n, r, i;
	var s, o, u, a;
	var f = 0;
	e = e.replace(/[^A-Za-z0-9+/=]/g, "");
	while (f < e.length) {
	    s = this._keyStr.indexOf(e.charAt(f++));
	    o = this._keyStr.indexOf(e.charAt(f++));
	    u = this._keyStr.indexOf(e.charAt(f++));
	    a = this._keyStr.indexOf(e.charAt(f++));
	    n = s << 2 | o >> 4;
	    r = (o & 15) << 4 | u >> 2;
	    i = (u & 3) << 6 | a;
	    t = t + String.fromCharCode(n);
	    if (u != 64) {
		t = t + String.fromCharCode(r);
	    }
	    if (a != 64) {
		t = t + String.fromCharCode(i);
	    }
	}
	// t = Base64._utf8_decode(t);
	return t;
    }
}



function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;


    // First atob !
    var byteCharacters = Base64.decode(b64Data); // #31: ExtendScript bad parse of /=

    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    	var slice = byteCharacters.slice(offset, offset + sliceSize);

    	var byteNumbers = new Array(slice.length);
    	for (var i = 0; i < slice.length; i++) {
    	    byteNumbers[i] = slice.charCodeAt(i);
    	}

    	var byteArray = new Uint8Array(byteNumbers);

    	byteArrays.push(byteArray);
    }

    var blob = new window.Blob(byteArrays, {
    	type: contentType
    });

    return blob;
}

/**
 * Start synthesize process
 * @returns {undefined}
 */
function run() {

    var input_text = $("#text-to-synth").val();
    var configuration = $("#text-configuration").val();
    //validate input text
    if (input_text.length === 0) {
	alert('text needs to be defined !');
    } else if (configuration.length == 0) {
	alert('configuration needs to be defined');
    } else {

	$.post(_baseUrl() + "process/", {
            "input": input_text,
            "configuration": configuration
	},
	       function(result) {

		   // if ("exception" in result) {
		   //     $("#text-result").val(JSON.stringify(result["exception"]));
		   //     return;
		   // }

		   var result_content = result["result"];
		   $("#text-result").val(result_content);

		   var json_result = JSON.parse(result_content);

		   if (json_result == null) {
		       return;
		   }
		   if ("audio" in json_result) {
		       $("#text-result").val(json_result["audio"]);

		       // Only audio
		       blob_wav = b64toBlob(json_result["audio"], "audio/x-wav");
		       wavesurfer.loadBlob(blob_wav);
		       $('#pause').prop('disabled', false);
		       $('#play').prop('disabled', false);
		       $('#save').prop('disabled', false);
		       //reset pause button state
		       $('#pause').attr('data-state', 'off');
		       $('#pause-text').text('Pause');
		       $('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');

		   } else if (("sequences" in json_result) && ("AUDIO" in json_result["sequences"])) {

		       // Extract the wave
		       blob_wav = b64toBlob(json_result["sequences"]["AUDIO"][0]["ais"], "audio/x-wav");
		       wavesurfer.loadBlob(blob_wav);

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




		   /*
		     list_phones = [];
		     for (var p in result.phrases)
		     {
		     for (var t in result.phrases[p].tokens)
		     {
		     for (var s in result.phrases[p].tokens[t].syllables)
		     {
		     for (var ph in result.phrases[p].tokens[t].syllables[s].phones)
		     {
		     list_phones.push(result.phrases[p].tokens[t].syllables[s].phones[ph]);
		     }
		     }
		     }
		     if (result.phrases[p].end_pause_duration !== 0)
		     {
		     var pause = new Object();
		     pause.label = "_"; // FIXME: hack the pause label
		     pause.duration = result.phrases[p].endPauseDuration;
		     list_phones.push(pause);
		     }
		     }

		   */
	       }
	      );
    }
}

/********************************************************************************************
 *** Global initialisation functions
 ********************************************************************************************/
$(document).ready(function() {

    // Create an instance
    wavesurfer = Object.create(WaveSurfer);

    // Init & load audio file
    var options = {
	container: document.querySelector('#waveform'),
	// FIXME: see for the scrollbar
	// fillParent    : false,
	// minPxPerSec   : 2000,
	waveColor: '#587d9d',
	progressColor: '#97c7de',
	height: 200,
	cursorColor: 'red'
    };

    if (location.search.match('scroll')) {
	options.minPxPerSec = 100;
	options.scrollParent = true;
    }

    // Init
    wavesurfer.init(options);
    wavesurfer.initRegions();

    //add zoom in/out slider
    var slider = document.querySelector('#slider');

    slider.oninput = function() {
	var zoomLevel = Number(slider.value);
	wavesurfer.zoom(zoomLevel);
    };

    // Play at once when ready
    // Won't work on iOS until you touch the page
    wavesurfer.on('ready', function() {
	//reset the zoom slider
	$('#slider').val(100);
	wavesurfer.zoom(100);
	// Add segmentation labels
	var segmentation = Object.create(WaveSurfer.Segmentation);
	segmentation.init({
	    wavesurfer: wavesurfer,
	    container: "#timeline"
	});

	// Add segmentation region
	var start = 0;
	wavesurfer.clearRegions();
	for (var p in list_phones) {
	    var region = new Object();
	    region.start = start;
	    region.drag = false;
	    region.end = start + (list_phones[p].duration / 1000);
	    region.color = randomColor(0.1);
	    wavesurfer.addRegion(region);
	    start += (list_phones[p].duration / 1000);
	}

	// // Add spectrogramm
	// var spectrogram = Object.create(WaveSurfer.Spectrogram);

	// spectrogram.init({
	//     wavesurfer: wavesurfer,
	//     container: "#spectrogram",
	//     fftSamples: 1024
	// });

	// Finally play
	wavesurfer.play();
    });

    // Report errors
    wavesurfer.on('error', function(err) {
	console.error(err);
    });

    // Do something when the clip is over
    wavesurfer.on('finish', function() {
	console.log('Finished playing');
    });


    /* Progress bar */
    document.addEventListener('DOMContentLoaded', function() {
	var progressDiv = document.querySelector('#progress-bar');
	var progressBar = progressDiv.querySelector('.progress-bar-blob');

	var showProgress = function(percent) {
	    progressDiv.style.display = 'block';
	    progressBar.style.width = percent + '%';
	};

	var hideProgress = function() {
	    progressDiv.style.display = 'none';
	};

	wavesurfer.on('loading', showProgress);
	wavesurfer.on('ready', hideProgress);
	wavesurfer.on('destroy', hideProgress);
	wavesurfer.on('error', hideProgress);
    });
});

/**
 * Random RGBA color.
 */
function randomColor(alpha) {
    return 'rgba(' + [~~(Math.random() * 255), ~~(Math.random() * 255), ~~(Math.random() * 255),
		      alpha || 1
		     ] + ')';
}
