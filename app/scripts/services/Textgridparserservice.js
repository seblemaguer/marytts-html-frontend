'use strict';

angular.module('MaryTTSHTMLFrontEnd')
	.service('Textgridparserservice', function Textgridparserservice($q) {
		// shared service object
		var sServObj = {};

		var worker = new TextGridParserWorker();
		var defer;

		// add event listener to worker to respond to messages
		worker.says(function (e) {
			if (e.status.type === 'SUCCESS') {
				defer.resolve(e.data);
			} else {
				defer.reject(e);
			}
		}, false);




		/**
		 * parse array of ssff file using webworker
		 * @param array of ssff files encoded as base64 stings
		 * @returns promise
		 */
		sServObj.asyncParseTextGrid = function (textGrid, sampleRate, annotates, name) {
			defer = $q.defer();
			worker.tell({
				'cmd': 'parseTG',
				'textGrid': textGrid,
				'sampleRate': sampleRate,
				'annotates': annotates,
				'name': name
			});
			return defer.promise;
		};


		return sServObj;

	});