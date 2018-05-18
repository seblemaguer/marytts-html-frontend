
'use strict';

angular.module('MaryTTSHTMLFrontEnd')
    .directive('configuration', function (MaryService) {
	return {
	    templateUrl: 'views/configuration.html',
	    restrict: 'E',
	    replace: true,
	    scope: {configuration : '='},
            controller: 'ConfigurationCtrl',
            controllerAs: 'configuration'
	};
    });
