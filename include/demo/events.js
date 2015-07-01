'use strict';

/* Mary global information */
var mary_host = "localhost";
var mary_port = "59125";

var current_voice = 0;
var current_language = 0;
var current_region = 0;

// Create an instance
var wavesurfer;
var list_phones;

/***********************************************************************************
 ** Listing
 ***********************************************************************************/

function listLanguages()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listLanguages";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText)['result'];
            
            var languages = document.getElementById('languages');
            languages.innerHTML = ""; // Clean first
            
            var len=result.length;
            for(var i=0; i<len; i++)
            {

	            var value = result[i];

                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = value;
                if (value == current_language)
                {
                    opt.selected = true;
                }
                
                languages.appendChild(opt);
            }
        }
    }
}


function listRegions()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listRegions";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?language=" + current_language , true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            
            var result = JSON.parse(xmlhttp.responseText)['result'];
            
            var regions = document.getElementById('regions');
            regions.innerHTML = ""; // Clean first
             
            var len=result.length;
            for(var i=0; i<len; i++)
            {
	            var value = result[i];

                var radio_item = document.createElement("input");
		        radio_item.type = "radio";
		        radio_item.name = "region";
		        radio_item.id = value;
		        radio_item.value = value;
                radio_item.onclick = selectRegion;
                
                if (value == current_region)
                {
		            radio_item.checked = true;
                }
                
		        var text_node = document.createTextNode(value);
                
                
		        var label = document.createElement("label");
		        label.appendChild(radio_item);
		        label.appendChild(text_node);
                
                regions.appendChild(label);
            }
        }
    }
}

function listVoices()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listVoices";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true); // FIXME: add locale !
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var result = JSON.parse(xmlhttp.responseText)['result'];
            var select = document.getElementsByName("voices")[0];
            select.innerHTML = "";
            select.options.length = 0;
            var len=result.length;
            for(var i=0; i<len; i++) {
	            var value = result[i];
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = value;
                if (value == current_voice)
                {
                    opt.selected = true;
                }
                select.appendChild(opt);
            }
            
        }
    }
}

/***********************************************************************************
 ** Initialisation
 ***********************************************************************************/
function getCurrentLanguage()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentLanguage";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_language = JSON.parse(xmlhttp.responseText)['result'];
            listLanguages();

            // Re new the region !
            getCurrentRegion();
        }
    }
}


function getCurrentRegion()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentRegion";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_region = JSON.parse(xmlhttp.responseText)['result'];
            listRegions();
        }
    }
}


function getCurrentVoice()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentVoice";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_voice = JSON.parse(xmlhttp.responseText)['result'];
            listVoices();
        }
    }
}


function initialisationMary()
{
}


/***********************************************************************************
 ** Setters
 ***********************************************************************************/

function selectLanguage()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setLanguage";

    var language = document.getElementById('languages').value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?language=" + language, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            getCurrentLanguage();
            getCurrentVoice();
        }
    }
}

function selectRegion()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setRegion";

    var region = 0;
    
    var radios = document.getElementsByName('region');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            region = radios[i].value;
            
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?region=" + region, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            getCurrentVoice();
        }
    }
}

function selectVoice()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setVoice";

    var voice = document.getElementById('voices').value;
    
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?voice=" + voice, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        }
    }
}

function setOutputLevel()
{
    
    // var base_url = "http://" + mary_host + ":" + mary_port + "/setLoggerLevel";
    
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.open("GET", base_url, true);
    // xmlhttp.send();

    
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         current_locale = JSON.parse(xmlhttp.responseText)['result'];
    //         listLocales();
    //     }
    // }
}




/*************************************************************************************************
 ** Marytts
 *************************************************************************************************/
function play (){
    wavesurfer.play();
}

function synthesize() {
    
    var base_url = "http://" + mary_host + ":" + mary_port + "/synthesize";

    //
    var input_text  = document.getElementsByName("text_to_synth")[0].value;
    if (input_text.length == 0)
    {
        alert('text needs to be defined !');
        throw new Error('text needs to be defined !');
    }
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?text='" + input_text + "'", true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            var result = JSON.parse(xmlhttp.responseText);
            
            // Change the output level
            if (! document.getElementById('none').checked)
            {
                document.getElementById('debug_area').style.display = 'inline';
                // document.getElementsByName('debug')[0].value = result['result'];
            }
            else
            {
                document.getElementById('debug_area').style.display = 'none';
            }

            // Get signal
            var xmlhttp_signal = new XMLHttpRequest();
            xmlhttp_signal.open("GET", "http://" + mary_host + ":" + mary_port + "/getSynthesizedSignal", true);
            xmlhttp_signal.responseType = 'blob';
            xmlhttp_signal.send();

            xmlhttp_signal.onload = function() {
                if (xmlhttp_signal.status == 200) {                
                    // if (! document.getElementById('none').checked)
                    // {
                    //     document.getElementsByName('debug')[0].value = xmlhttp_signal.responseText;
                    // }
                    wavesurfer.loadBlob(xmlhttp_signal.response);
                    // document.getElementsByName("save")[0].disabled = false; FIXME: not working yet
                    document.getElementsByName("play")[0].disabled = false;
                }
            }
        }
    }
}

function synth () {
    var base_url = "http://" + mary_host + ":" + mary_port + "/process";

    //
    var input_text  = document.getElementsByName("text_to_synth")[0].value;
    var input_type  = "TEXT";
    var output_type = "ACOUSTPARAMS";
    var locale = "en_US"; // FIXME: harcoded locale !
    var audio = "WAVE_FILE";

    if (input_text.length == 0)
    {
        alert('text needs to be defined !');
        throw new Error('text needs to be defined !');
    }
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    var url = base_url + "?input='" + input_text;
    url += "'&inputType=" + input_type;
    url += "&outputType=" + output_type+ "";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var result = JSON.parse(xmlhttp.responseText)['result'];
            var res = "==>";
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
            }
            alert(list_phones);
            
            // Change the output level
            if (!document.getElementById('none').checked)
            {
                document.getElementById('debug_area').style.display = 'inline';
                // document.getElementsByName('debug')[0].value = result['result'];
            }
            else
            {
                document.getElementById('debug_area').style.display = 'none';
            }

            // Achieve the synthesis
            synthesize();
        }
    }
}

/********************************************************************************************
 *** Global initialisation functions
 ********************************************************************************************/
function initialisation_demo()
{
    getCurrentLanguage(); // Implicit renew the region too !
    getCurrentVoice();
    
    // Create an instance
    wavesurfer = Object.create(WaveSurfer);
    
    // Init & load audio file
    var options = {
        container     : document.querySelector('#waveform'),
        // FIXME: see for the scrollbar
        // fillParent    : false,
        // minPxPerSec   : 2000,
        waveColor     : '#587d9d',
        progressColor : '#97c7de',
        height:200,
        cursorColor   : 'red'
    };
    
    if (location.search.match('scroll')) {
        options.minPxPerSec = 100;
        options.scrollParent = true;
    }
    
    // Init
    wavesurfer.init(options);
    
    // Regions
    if (wavesurfer.enableDragSelection) {
        wavesurfer.enableDragSelection({
            color: 'rgba(0, 255, 0, 0.1)'
        });
    }
    
    // Play at once when ready
    // Won't work on iOS until you touch the page
    wavesurfer.on('ready', function () {
        var segmentation = Object.create(WaveSurfer.Segmentation);
        segmentation.init({
            wavesurfer: wavesurfer,
            container: "#timeline"
        });
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
        var progressBar = progressDiv.querySelector('.progress-bar');
        
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
}
