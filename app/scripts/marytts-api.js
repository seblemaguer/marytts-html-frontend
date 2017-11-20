
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
