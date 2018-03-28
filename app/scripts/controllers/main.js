'use strict';

/**
 * @ngdoc function
 * @name MaryTTSHTMLFrontEnd.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MaryTTSHTMLFrontEnd')
  .controller('MainCtrl', function ($scope,$rootScope,$location, MaryService, moduleSequenceService,AnnotService) {

  		$scope.fs = MaryService;

  		$scope.mss = moduleSequenceService;

  		// $scope.$watch("fs.audioBuffer", function(newVal){
  		// 	console.log("Valeur " + newVal);
  		// });

  		$scope.as = AnnotService;

	    $scope.$watch('fs.getAudioBuffer()', function(newVal,oldVal){
	            if(newVal!==oldVal){
	              $scope.levels = [];
	            }
	    });

	    $scope.$watch('fs.configuration', function(newVal,oldVal){
	            if(newVal!==oldVal){
	            	$scope.configuration = JSON.stringify($scope.fs.configuration,null,4);
	            }
	    });

	    $scope.$watch('mss.moduleSequence', function(newVal,oldVal){
	            if(newVal!==oldVal){
	            	var tampon = JSON.parse($scope.configuration);
	            	tampon["marytts.runutils.Request"]["module_sequence"] = $scope.mss.moduleSequence;
	            	tampon["marytts.runutils.Request"]["input_serializer"] = $scope.mss.input;
	            	tampon["marytts.runutils.Request"]["output_serializer"] = $scope.mss.output;
	            	$scope.configuration = JSON.stringify(tampon,null,4);
	            }
	    },true);


	  	$scope.$watch('as.getAnnot()', function(newVal,oldVal){
	  		if(newVal!==oldVal){
	  			$scope.levels = [];
	  			//Ici ajouter les directives pour les levels - Extraire SEGMENTS et EVENT et les rajouter dans levels
	  			newVal.levels.forEach(function(level){
	  				if(level.type==="SEGMENT" || level.type==="EVENT"){
	  					$scope.levels.push(level);
	  				}
	  			});
	  		}
	  	});
	  	$scope.mss.setModuleSequence($scope.fs.configuration["marytts.runutils.Request"]["module_sequence"]);
	  	$scope.mss.setInput($scope.fs.configuration["marytts.runutils.Request"]["input_serializer"]);
	  	$scope.mss.setOutput($scope.fs.configuration["marytts.runutils.Request"]["output_serializer"]);

	    $scope.configuration = JSON.stringify($scope.fs.configuration,null,4);

	  	$scope.testLevel = function(){
	  			$scope.fs.loadStaticBuffer();
	  			var annotJson = {
	  			"name": "msajc003",
	  			"annotates": "msajc003.wav",
	  			"sampleRate": 20000,
	  			"levels": [{
	  				"name": "Utterance",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 8,
	  					"labels": [{
	  						"name": "Utterance",
	  						"value": ""
	  					}]
	  				}]
	  			}, {
	  				"name": "Intonational",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 7,
	  					"labels": [{
	  						"name": "Intonational",
	  						"value": "L%"
	  					}]
	  				}]
	  			}, {
	  				"name": "Intermediate",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 5,
	  					"labels": [{
	  						"name": "Intermediate",
	  						"value": "L-"
	  					}]
	  				}, {
	  					"id": 46,
	  					"labels": [{
	  						"name": "Intermediate",
	  						"value": "L-"
	  					}]
	  				}]
	  			}, {
	  				"name": "Word",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 2,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "C"
	  					}, {
	  						"name": "Accent",
	  						"value": "S"
	  					}, {
	  						"name": "Text",
	  						"value": "amongst"
	  					}]
	  				}, {
	  					"id": 24,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "F"
	  					}, {
	  						"name": "Accent",
	  						"value": "W"
	  					}, {
	  						"name": "Text",
	  						"value": "her"
	  					}]
	  				}, {
	  					"id": 30,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "C"
	  					}, {
	  						"name": "Accent",
	  						"value": "S"
	  					}, {
	  						"name": "Text",
	  						"value": "friends"
	  					}]
	  				}, {
	  					"id": 43,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "F"
	  					}, {
	  						"name": "Accent",
	  						"value": "W"
	  					}, {
	  						"name": "Text",
	  						"value": "she"
	  					}]
	  				}, {
	  					"id": 52,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "F"
	  					}, {
	  						"name": "Accent",
	  						"value": "W"
	  					}, {
	  						"name": "Text",
	  						"value": "was"
	  					}]
	  				}, {
	  					"id": 61,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "C"
	  					}, {
	  						"name": "Accent",
	  						"value": "W"
	  					}, {
	  						"name": "Text",
	  						"value": "considered"
	  					}]
	  				}, {
	  					"id": 83,
	  					"labels": [{
	  						"name": "Word",
	  						"value": "C"
	  					}, {
	  						"name": "Accent",
	  						"value": "S"
	  					}, {
	  						"name": "Text",
	  						"value": "beautiful"
	  					}]
	  				}]
	  			}, {
	  				"name": "Syllable",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 102,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}, {
	  					"id": 103,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "S"
	  					}]
	  				}, {
	  					"id": 104,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "S"
	  					}]
	  				}, {
	  					"id": 105,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "S"
	  					}]
	  				}, {
	  					"id": 106,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}, {
	  					"id": 107,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}, {
	  					"id": 108,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}, {
	  					"id": 109,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "S"
	  					}]
	  				}, {
	  					"id": 110,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}, {
	  					"id": 111,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "S"
	  					}]
	  				}, {
	  					"id": 112,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}, {
	  					"id": 113,
	  					"labels": [{
	  						"name": "Syllable",
	  						"value": "W"
	  					}]
	  				}]
	  			}, {
	  				"name": "Phoneme",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 114,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "V"
	  					}]
	  				}, {
	  					"id": 115,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "m"
	  					}]
	  				}, {
	  					"id": 116,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "V"
	  					}]
	  				}, {
	  					"id": 117,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "N"
	  					}]
	  				}, {
	  					"id": 118,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "s"
	  					}]
	  				}, {
	  					"id": 119,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "t"
	  					}]
	  				}, {
	  					"id": 120,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "@:"
	  					}]
	  				}, {
	  					"id": 121,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "f"
	  					}]
	  				}, {
	  					"id": 122,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "r"
	  					}]
	  				}, {
	  					"id": 123,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "E"
	  					}]
	  				}, {
	  					"id": 124,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "n"
	  					}]
	  				}, {
	  					"id": 125,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "z"
	  					}]
	  				}, {
	  					"id": 126,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "S"
	  					}]
	  				}, {
	  					"id": 127,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "i:"
	  					}]
	  				}, {
	  					"id": 128,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "w"
	  					}]
	  				}, {
	  					"id": 129,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "@"
	  					}]
	  				}, {
	  					"id": 130,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "z"
	  					}]
	  				}, {
	  					"id": 131,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "k"
	  					}]
	  				}, {
	  					"id": 132,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "@"
	  					}]
	  				}, {
	  					"id": 133,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "n"
	  					}]
	  				}, {
	  					"id": 134,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "s"
	  					}]
	  				}, {
	  					"id": 135,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "I"
	  					}]
	  				}, {
	  					"id": 136,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "d"
	  					}]
	  				}, {
	  					"id": 137,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "@"
	  					}]
	  				}, {
	  					"id": 138,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "d"
	  					}]
	  				}, {
	  					"id": 139,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "b"
	  					}]
	  				}, {
	  					"id": 140,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "j"
	  					}]
	  				}, {
	  					"id": 141,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "u:"
	  					}]
	  				}, {
	  					"id": 142,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "d"
	  					}]
	  				}, {
	  					"id": 143,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "@"
	  					}]
	  				}, {
	  					"id": 144,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "f"
	  					}]
	  				}, {
	  					"id": 145,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "@"
	  					}]
	  				}, {
	  					"id": 146,
	  					"labels": [{
	  						"name": "Phoneme",
	  						"value": "l"
	  					}]
	  				}]
	  			}, {
	  				"name": "Phonetic",
	  				"type": "SEGMENT",
	  				"items": [{
	  					"id": 147,
	  					"sampleStart": 3750,
	  					"sampleDur": 1389,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "V"
	  					}, {
	  						"name": "IPA",
	  						"value": "ʌ"
	  					}]
	  				}, {
	  					"id": 148,
	  					"sampleStart": 5140,
	  					"sampleDur": 1664,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "m"
	  					}, {
	  						"name": "IPA",
	  						"value": "m"
	  					}]
	  				}, {
	  					"id": 149,
	  					"sampleStart": 6805,
	  					"sampleDur": 1729,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "V"
	  					}, {
	  						"name": "IPA",
	  						"value": "ʌ"
	  					}]
	  				}, {
	  					"id": 150,
	  					"sampleStart": 8535,
	  					"sampleDur": 1134,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "N"
	  					}, {
	  						"name": "IPA",
	  						"value": "ŋ"
	  					}]
	  				}, {
	  					"id": 151,
	  					"sampleStart": 9670,
	  					"sampleDur": 1669,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "s"
	  					}, {
	  						"name": "IPA",
	  						"value": "s"
	  					}]
	  				}, {
	  					"id": 152,
	  					"sampleStart": 11340,
	  					"sampleDur": 594,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "t"
	  					}, {
	  						"name": "IPA",
	  						"value": "t"
	  					}]
	  				}, {
	  					"id": 153,
	  					"sampleStart": 11935,
	  					"sampleDur": 1549,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "H"
	  					}, {
	  						"name": "IPA",
	  						"value": "ɥ"
	  					}]
	  				}, {
	  					"id": 154,
	  					"sampleStart": 13485,
	  					"sampleDur": 1314,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "@:"
	  					}, {
	  						"name": "IPA",
	  						"value": "@:"
	  					}]
	  				}, {
	  					"id": 155,
	  					"sampleStart": 14800,
	  					"sampleDur": 3054,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "f"
	  					}, {
	  						"name": "IPA",
	  						"value": "f"
	  					}]
	  				}, {
	  					"id": 156,
	  					"sampleStart": 17855,
	  					"sampleDur": 1144,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "r"
	  					}, {
	  						"name": "IPA",
	  						"value": "r"
	  					}]
	  				}, {
	  					"id": 157,
	  					"sampleStart": 19000,
	  					"sampleDur": 1639,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "E"
	  					}, {
	  						"name": "IPA",
	  						"value": "ɛ"
	  					}]
	  				}, {
	  					"id": 158,
	  					"sampleStart": 20640,
	  					"sampleDur": 3279,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "n"
	  					}, {
	  						"name": "IPA",
	  						"value": "n"
	  					}]
	  				}, {
	  					"id": 159,
	  					"sampleStart": 23920,
	  					"sampleDur": 1869,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "z"
	  					}, {
	  						"name": "IPA",
	  						"value": "z"
	  					}]
	  				}, {
	  					"id": 160,
	  					"sampleStart": 25790,
	  					"sampleDur": 2609,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "S"
	  					}, {
	  						"name": "IPA",
	  						"value": "ʃ"
	  					}]
	  				}, {
	  					"id": 161,
	  					"sampleStart": 28400,
	  					"sampleDur": 864,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "i:"
	  					}, {
	  						"name": "IPA",
	  						"value": "iː"
	  					}]
	  				}, {
	  					"id": 162,
	  					"sampleStart": 29265,
	  					"sampleDur": 859,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "w"
	  					}, {
	  						"name": "IPA",
	  						"value": "w"
	  					}]
	  				}, {
	  					"id": 163,
	  					"sampleStart": 30125,
	  					"sampleDur": 844,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "@"
	  					}, {
	  						"name": "IPA",
	  						"value": "ə"
	  					}]
	  				}, {
	  					"id": 164,
	  					"sampleStart": 30970,
	  					"sampleDur": 1719,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "z"
	  					}, {
	  						"name": "IPA",
	  						"value": "z"
	  					}]
	  				}, {
	  					"id": 165,
	  					"sampleStart": 32690,
	  					"sampleDur": 829,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "k"
	  					}, {
	  						"name": "IPA",
	  						"value": "k"
	  					}]
	  				}, {
	  					"id": 166,
	  					"sampleStart": 33520,
	  					"sampleDur": 789,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "H"
	  					}, {
	  						"name": "IPA",
	  						"value": "ɥ"
	  					}]
	  				}, {
	  					"id": 167,
	  					"sampleStart": 34310,
	  					"sampleDur": 519,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "@"
	  					}, {
	  						"name": "IPA",
	  						"value": "ə"
	  					}]
	  				}, {
	  					"id": 168,
	  					"sampleStart": 34830,
	  					"sampleDur": 999,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "n"
	  					}, {
	  						"name": "IPA",
	  						"value": "n"
	  					}]
	  				}, {
	  					"id": 169,
	  					"sampleStart": 35830,
	  					"sampleDur": 2034,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "s"
	  					}, {
	  						"name": "IPA",
	  						"value": "s"
	  					}]
	  				}, {
	  					"id": 170,
	  					"sampleStart": 37865,
	  					"sampleDur": 1044,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "I"
	  					}, {
	  						"name": "IPA",
	  						"value": "ɪ"
	  					}]
	  				}, {
	  					"id": 171,
	  					"sampleStart": 38910,
	  					"sampleDur": 424,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "d"
	  					}, {
	  						"name": "IPA",
	  						"value": "d"
	  					}]
	  				}, {
	  					"id": 172,
	  					"sampleStart": 39335,
	  					"sampleDur": 1339,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "@"
	  					}, {
	  						"name": "IPA",
	  						"value": "ə"
	  					}]
	  				}, {
	  					"id": 173,
	  					"sampleStart": 40675,
	  					"sampleDur": 2329,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "db"
	  					}, {
	  						"name": "IPA",
	  						"value": "db"
	  					}]
	  				}, {
	  					"id": 174,
	  					"sampleStart": 43005,
	  					"sampleDur": 1219,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "j"
	  					}, {
	  						"name": "IPA",
	  						"value": "j"
	  					}]
	  				}, {
	  					"id": 175,
	  					"sampleStart": 44225,
	  					"sampleDur": 1449,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "u:"
	  					}, {
	  						"name": "IPA",
	  						"value": "uː"
	  					}]
	  				}, {
	  					"id": 176,
	  					"sampleStart": 45675,
	  					"sampleDur": 384,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "dH"
	  					}, {
	  						"name": "IPA",
	  						"value": "dH"
	  					}]
	  				}, {
	  					"id": 177,
	  					"sampleStart": 46060,
	  					"sampleDur": 1179,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "@"
	  					}, {
	  						"name": "IPA",
	  						"value": "ə"
	  					}]
	  				}, {
	  					"id": 178,
	  					"sampleStart": 47240,
	  					"sampleDur": 1709,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "f"
	  					}, {
	  						"name": "IPA",
	  						"value": "f"
	  					}]
	  				}, {
	  					"id": 179,
	  					"sampleStart": 48950,
	  					"sampleDur": 1175,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "@"
	  					}, {
	  						"name": "IPA",
	  						"value": "ə"
	  					}]
	  				}, {
	  					"id": 180,
	  					"sampleStart": 50126,
	  					"sampleDur": 1963,
	  					"labels": [{
	  						"name": "Phonetic",
	  						"value": "l"
	  					}, {
	  						"name": "IPA",
	  						"value": "l"
	  					}]
	  				}]
	  			}, {
	  				"name": "Tone",
	  				"type": "EVENT",
	  				"items": [{
	  					"id": 181,
	  					"samplePoint": 8382,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "H*"
	  					}]
	  				}, {
	  					"id": 182,
	  					"samplePoint": 18632,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "H*"
	  					}]
	  				}, {
	  					"id": 183,
	  					"samplePoint": 22140,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "L-"
	  					}]
	  				}, {
	  					"id": 184,
	  					"samplePoint": 38255,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "H*"
	  					}]
	  				}, {
	  					"id": 185,
	  					"samplePoint": 44613,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "H*"
	  					}]
	  				}, {
	  					"id": 186,
	  					"samplePoint": 50862,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "L-"
	  					}]
	  				}, {
	  					"id": 187,
	  					"samplePoint": 51553,
	  					"labels": [{
	  						"name": "Tone",
	  						"value": "L%"
	  					}]
	  				}]
	  			}, {
	  				"name": "Foot",
	  				"type": "ITEM",
	  				"items": [{
	  					"id": 47,
	  					"labels": [{
	  						"name": "Foot",
	  						"value": "F"
	  					}]
	  				}, {
	  					"id": 53,
	  					"labels": [{
	  						"name": "Foot",
	  						"value": "F"
	  					}]
	  				}, {
	  					"id": 62,
	  					"labels": [{
	  						"name": "Foot",
	  						"value": "F"
	  					}]
	  				}, {
	  					"id": 71,
	  					"labels": [{
	  						"name": "Foot",
	  						"value": "F"
	  					}]
	  				}, {
	  					"id": 84,
	  					"labels": [{
	  						"name": "Foot",
	  						"value": "F"
	  					}]
	  				}]
	  			}],
	  		    "links": [
	  		        {
	  		            "fromID": 8,
	  		            "toID": 7
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 5
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 46
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 47
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 53
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 62
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 71
	  		        },
	  		        {
	  		            "fromID": 7,
	  		            "toID": 84
	  		        },
	  		        {
	  		            "fromID": 5,
	  		            "toID": 2
	  		        },
	  		        {
	  		            "fromID": 5,
	  		            "toID": 24
	  		        },
	  		        {
	  		            "fromID": 5,
	  		            "toID": 30
	  		        },
	  		        {
	  		            "fromID": 46,
	  		            "toID": 43
	  		        },
	  		        {
	  		            "fromID": 46,
	  		            "toID": 52
	  		        },
	  		        {
	  		            "fromID": 46,
	  		            "toID": 61
	  		        },
	  		        {
	  		            "fromID": 46,
	  		            "toID": 83
	  		        },
	  		        {
	  		            "fromID": 2,
	  		            "toID": 102
	  		        },
	  		        {
	  		            "fromID": 2,
	  		            "toID": 103
	  		        },
	  		        {
	  		            "fromID": 24,
	  		            "toID": 104
	  		        },
	  		        {
	  		            "fromID": 30,
	  		            "toID": 105
	  		        },
	  		        {
	  		            "fromID": 43,
	  		            "toID": 106
	  		        },
	  		        {
	  		            "fromID": 52,
	  		            "toID": 107
	  		        },
	  		        {
	  		            "fromID": 61,
	  		            "toID": 108
	  		        },
	  		        {
	  		            "fromID": 61,
	  		            "toID": 109
	  		        },
	  		        {
	  		            "fromID": 61,
	  		            "toID": 110
	  		        },
	  		        {
	  		            "fromID": 83,
	  		            "toID": 111
	  		        },
	  		        {
	  		            "fromID": 83,
	  		            "toID": 112
	  		        },
	  		        {
	  		            "fromID": 83,
	  		            "toID": 113
	  		        },
	  		        {
	  		            "fromID": 102,
	  		            "toID": 114
	  		        },
	  		        {
	  		            "fromID": 103,
	  		            "toID": 115
	  		        },
	  		        {
	  		            "fromID": 103,
	  		            "toID": 116
	  		        },
	  		        {
	  		            "fromID": 103,
	  		            "toID": 117
	  		        },
	  		        {
	  		            "fromID": 103,
	  		            "toID": 118
	  		        },
	  		        {
	  		            "fromID": 103,
	  		            "toID": 119
	  		        },
	  		        {
	  		            "fromID": 104,
	  		            "toID": 120
	  		        },
	  		        {
	  		            "fromID": 104,
	  		            "toID": 181
	  		        },
	  		        {
	  		            "fromID": 105,
	  		            "toID": 121
	  		        },
	  		        {
	  		            "fromID": 105,
	  		            "toID": 122
	  		        },
	  		        {
	  		            "fromID": 105,
	  		            "toID": 123
	  		        },
	  		        {
	  		            "fromID": 105,
	  		            "toID": 124
	  		        },
	  		        {
	  		            "fromID": 105,
	  		            "toID": 125
	  		        },
	  		        {
	  		            "fromID": 105,
	  		            "toID": 182
	  		        },
	  		        {
	  		            "fromID": 106,
	  		            "toID": 126
	  		        },
	  		        {
	  		            "fromID": 106,
	  		            "toID": 127
	  		        },
	  		        {
	  		            "fromID": 107,
	  		            "toID": 128
	  		        },
	  		        {
	  		            "fromID": 107,
	  		            "toID": 129
	  		        },
	  		        {
	  		            "fromID": 107,
	  		            "toID": 130
	  		        },
	  		        {
	  		            "fromID": 108,
	  		            "toID": 131
	  		        },
	  		        {
	  		            "fromID": 108,
	  		            "toID": 132
	  		        },
	  		        {
	  		            "fromID": 108,
	  		            "toID": 133
	  		        },
	  		        {
	  		            "fromID": 109,
	  		            "toID": 134
	  		        },
	  		        {
	  		            "fromID": 109,
	  		            "toID": 135
	  		        },
	  		        {
	  		            "fromID": 109,
	  		            "toID": 184
	  		        },
	  		        {
	  		            "fromID": 110,
	  		            "toID": 136
	  		        },
	  		        {
	  		            "fromID": 110,
	  		            "toID": 137
	  		        },
	  		        {
	  		            "fromID": 110,
	  		            "toID": 138
	  		        },
	  		        {
	  		            "fromID": 111,
	  		            "toID": 139
	  		        },
	  		        {
	  		            "fromID": 111,
	  		            "toID": 140
	  		        },
	  		        {
	  		            "fromID": 111,
	  		            "toID": 141
	  		        },
	  		        {
	  		            "fromID": 111,
	  		            "toID": 185
	  		        },
	  		        {
	  		            "fromID": 112,
	  		            "toID": 142
	  		        },
	  		        {
	  		            "fromID": 112,
	  		            "toID": 143
	  		        },
	  		        {
	  		            "fromID": 113,
	  		            "toID": 144
	  		        },
	  		        {
	  		            "fromID": 113,
	  		            "toID": 145
	  		        },
	  		        {
	  		            "fromID": 113,
	  		            "toID": 146
	  		        },
	  		        {
	  		            "fromID": 114,
	  		            "toID": 147
	  		        },
	  		        {
	  		            "fromID": 115,
	  		            "toID": 148
	  		        },
	  		        {
	  		            "fromID": 116,
	  		            "toID": 149
	  		        },
	  		        {
	  		            "fromID": 117,
	  		            "toID": 150
	  		        },
	  		        {
	  		            "fromID": 118,
	  		            "toID": 151
	  		        },
	  		        {
	  		            "fromID": 119,
	  		            "toID": 152
	  		        },
	  		        {
	  		            "fromID": 119,
	  		            "toID": 153
	  		        },
	  		        {
	  		            "fromID": 120,
	  		            "toID": 154
	  		        },
	  		        {
	  		            "fromID": 121,
	  		            "toID": 155
	  		        },
	  		        {
	  		            "fromID": 122,
	  		            "toID": 156
	  		        },
	  		        {
	  		            "fromID": 123,
	  		            "toID": 157
	  		        },
	  		        {
	  		            "fromID": 124,
	  		            "toID": 158
	  		        },
	  		        {
	  		            "fromID": 125,
	  		            "toID": 159
	  		        },
	  		        {
	  		            "fromID": 126,
	  		            "toID": 160
	  		        },
	  		        {
	  		            "fromID": 127,
	  		            "toID": 161
	  		        },
	  		        {
	  		            "fromID": 128,
	  		            "toID": 162
	  		        },
	  		        {
	  		            "fromID": 129,
	  		            "toID": 163
	  		        },
	  		        {
	  		            "fromID": 130,
	  		            "toID": 164
	  		        },
	  		        {
	  		            "fromID": 131,
	  		            "toID": 165
	  		        },
	  		        {
	  		            "fromID": 131,
	  		            "toID": 166
	  		        },
	  		        {
	  		            "fromID": 132,
	  		            "toID": 167
	  		        },
	  		        {
	  		            "fromID": 133,
	  		            "toID": 168
	  		        },
	  		        {
	  		            "fromID": 134,
	  		            "toID": 169
	  		        },
	  		        {
	  		            "fromID": 135,
	  		            "toID": 170
	  		        },
	  		        {
	  		            "fromID": 136,
	  		            "toID": 171
	  		        },
	  		        {
	  		            "fromID": 137,
	  		            "toID": 172
	  		        },
	  		        {
	  		            "fromID": 138,
	  		            "toID": 173
	  		        },
	  		        {
	  		            "fromID": 139,
	  		            "toID": 173
	  		        },
	  		        {
	  		            "fromID": 140,
	  		            "toID": 174
	  		        },
	  		        {
	  		            "fromID": 141,
	  		            "toID": 175
	  		        },
	  		        {
	  		            "fromID": 142,
	  		            "toID": 176
	  		        },
	  		        {
	  		            "fromID": 143,
	  		            "toID": 177
	  		        },
	  		        {
	  		            "fromID": 144,
	  		            "toID": 178
	  		        },
	  		        {
	  		            "fromID": 145,
	  		            "toID": 179
	  		        },
	  		        {
	  		            "fromID": 146,
	  		            "toID": 180
	  		        },
	  		        {
	  		            "fromID": 47,
	  		            "toID": 103
	  		        },
	  		        {
	  		            "fromID": 53,
	  		            "toID": 104
	  		        },
	  		        {
	  		            "fromID": 62,
	  		            "toID": 105
	  		        },
	  		        {
	  		            "fromID": 62,
	  		            "toID": 106
	  		        },
	  		        {
	  		            "fromID": 62,
	  		            "toID": 107
	  		        },
	  		        {
	  		            "fromID": 62,
	  		            "toID": 108
	  		        },
	  		        {
	  		            "fromID": 71,
	  		            "toID": 109
	  		        },
	  		        {
	  		            "fromID": 71,
	  		            "toID": 110
	  		        },
	  		        {
	  		            "fromID": 84,
	  		            "toID": 111
	  		        },
	  		        {
	  		            "fromID": 84,
	  		            "toID": 112
	  		        },
	  		        {
	  		            "fromID": 84,
	  		            "toID": 113
	  		        }
	  		    ]
	  		};
	  		$scope.as.setAnnot(annotJson);
	  	}


  });
