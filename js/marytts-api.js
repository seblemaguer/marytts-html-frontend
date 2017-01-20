'use strict';

/* Mary global information */
var MARY_HOST = "localhost";
var MARY_PORT = "59125";

var current_voice = 0;
var current_language = 0;
var current_region = 0;

var wavesurfer;  // Wavesurfer instance
var blob_wav;    // Wav buffer
var list_phones; // Phone list for the segmentation part

/**
 * Get base Mary HTTP server url
 * @returns {String} base server URL
 */
function _baseUrl() {
    return "http://" + MARY_HOST + ":" + MARY_PORT + "/";
}

/***********************************************************************************
 ** Listing
 ***********************************************************************************/
/**
 * List all languages
 * @returns {undefined}
 */
function listLanguages()
{
    $.get(_baseUrl() + 'listLanguages',
            function (response) {
                $('#languages').children().remove();
                //add new option
                var len = response.result.length;
                for (var i = 0; i < len; i++)
                {
                    var value = response.result[i];

                    var opt = document.createElement('option');
                    opt.value = value;
                    opt.innerHTML = value;
                    if (value === current_language)
                    {
                        opt.selected = true;
                    }

                    $("#languages").append(opt);
                }
            }, 'json');
}

/**
 * List all regions
 * @returns {undefined}
 */
function listRegions()
{
    $.get(_baseUrl() + 'listRegions' + "?language=" + current_language,
            function (response) {
                $('#regions').empty();
                //add new option
                var len = response.result.length;
                for (var i = 0; i < len; i++)
                {
                    var value = response.result[i];

                    var radio_item = document.createElement("input");
                    radio_item.type = "radio";
                    radio_item.name = "region";
                    radio_item.id = value;
                    radio_item.value = value;
                    radio_item.onclick = selectRegion;

                    if (value === current_region)
                    {
                        radio_item.checked = true;
                    }

                    var text_node = document.createTextNode(value);

                    var label = document.createElement("label");
                    label.style = 'margin-right:10px;';
                    label.appendChild(radio_item);
                    label.appendChild(text_node);

                    $('#regions').append(label);
                }
            }, 'json');
}

/**
 * List all voices
 * @returns {undefined}
 */
function listVoices()
{
    $.get(_baseUrl() + 'listVoices',
            function (response) {
                $('#voices').children().remove();
                //add new option
                var len = response.result.length;
                for (var i = 0; i < len; i++)
                {
                    var value = response.result[i];

                    var opt = document.createElement('option');
                    opt.value = value;
                    opt.innerHTML = value;
                    if (value === current_voice)
                    {
                        opt.selected = true;
                    }

                    $("#voices").append(opt);
                }
            }, 'json');
}

/***********************************************************************************
 ** Getter Methods
 ***********************************************************************************/
/*
 * Get current language
 * @returns {undefined}
 */
function getCurrentLanguage()
{
    $.get(_baseUrl() + 'getCurrentLanguage',
            function (response) {
                current_language = response.result;
                //list languages
                listLanguages();
                //get current regions
                getCurrentRegion();
            }, 'json');
}
/**
 * Get current region
 * @returns {undefined}
 */
function getCurrentRegion()
{
    $.get(_baseUrl() + 'getCurrentRegion',
            function (response) {
                current_region = response.result;
                //list regions
                listRegions();
            }, 'json');
}
/**
 * Get current voice
 * @returns {undefined}
 */
function getCurrentVoice()
{
    $.get(_baseUrl() + 'getCurrentVoice',
            function (response) {
                current_voice = response.result;
                //list voices
                listVoices();
            }, 'json');
}

/***********************************************************************************
 ** Setters
 ***********************************************************************************/
/**
 * Select language
 * @returns {undefined}
 */
function selectLanguage()
{
    $.get(_baseUrl() + 'setLanguage' + "?language=" + $('#languages').val(),
            function (response) {
                //update current language & voices
                getCurrentLanguage();
                getCurrentVoice();
            }, 'json');
}
/**
 * Select region
 * @returns {undefined}
 */
function selectRegion()
{
    var region = $('input[name="region"]:checked').val();

    $.get(_baseUrl() + 'setRegion' + "?region=" + region,
            function (response) {
                //update current voices
                getCurrentVoice();
            }, 'json');
}
/**
 * Select voice
 * @returns {undefined}
 */
function selectVoice()
{
    $.get(_baseUrl() + 'setVoice' + "?voice=" + $('#voices').val(),
            function (response) {
                //do nothing
            }, 'json');
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
 * Set output level
 * @param {type} value - output type
 * @returns {undefined}
 */
function setLevel(value) {
    if (!$('#none').is(':checked')) {
        $('#debug_area').css('display', 'inline');
    } else {
        $('#debug_area').css('display', 'none');
    }
}

/**
 * Synthesize the text
 * @returns {undefined}
 */
function synthesize() {

    var input_text = $("#text-to-synth").val();
    //validate input text
    if (input_text.length === 0)
    {
        alert('text needs to be defined !');
    } else {

        $.get(_baseUrl() + 'synthesize' + "?text=" + input_text,
                function (response) {
                    // Change the output level
                    setLevel();
                    // Get signal
                    var xmlhttp_signal = new XMLHttpRequest();
                    xmlhttp_signal.open("GET", _baseUrl() + "getSynthesizedSignal", true);
                    xmlhttp_signal.responseType = 'blob';
                    xmlhttp_signal.send();

                    xmlhttp_signal.onload = function () {
                        if (xmlhttp_signal.status === 200) {
                            // TODO: debug !
                            // if (! document.getElementById('none').checked)
                            // {
                            //     document.getElementsByName('debug')[0].value = xmlhttp_signal.responseText;
                            // }
                            // Save wav conent to memory and play it
                            blob_wav = xmlhttp_signal.response;
                            wavesurfer.loadBlob(blob_wav);

                            // Enable the buttons
                            $('#pause').prop('disabled', false);
                            $('#play').prop('disabled', false);
                            $('#save').prop('disabled', false);
                            //reset pause button state
                            $('#pause').attr('data-state', 'off');
                            $('#pause-text').text('Pause');
                            $('#pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');
                            //scroll down to bottom
                            $("html, body").animate({scrollTop: $(document).height()}, 1000);
                        }
                    }
                }, 'json');
    }
}

/**
 * Start synthesize process
 * @returns {undefined}
 */
function synth() {

    var input_text = $("#text-to-synth").val();
    //validate input text
    if (input_text.length === 0) {
        alert('text needs to be defined !');
    } else {
        var input_type = "TEXT";
        var output_type = "REALISED_ACOUSTPARAMS";
        var locale = "en_US"; // FIXME: harcoded locale !
        var audio = "WAVE_FILE";

        var url = _baseUrl() + "process?input='" + input_text;
        url += "'&inputType=" + input_type;
        url += "&outputType=" + output_type + "";

        //send request
        $.get(url,
                function (response) {
                    var result = response.result;
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
                    // Change the output level
                    setLevel();
                    // Achieve the synthesis
                    synthesize();
                }, 'json');
    }
}
/********************************************************************************************
 *** Global initialisation functions
 ********************************************************************************************/
$(document).ready(function () {

    //list languages & voices
    getCurrentLanguage();
    getCurrentVoice();

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

    slider.oninput = function () {
        var zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
    };

    // Play at once when ready
    // Won't work on iOS until you touch the page
    wavesurfer.on('ready', function () {
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
    wavesurfer.on('error', function (err) {
        console.error(err);
    });

    // Do something when the clip is over
    wavesurfer.on('finish', function () {
        console.log('Finished playing');
    });


    /* Progress bar */
    document.addEventListener('DOMContentLoaded', function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar-blob');

        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        var hideProgress = function () {
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
    return 'rgba(' + [
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        alpha || 1
    ] + ')';
}
