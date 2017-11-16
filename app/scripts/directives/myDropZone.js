'use strict';

angular.module('testApp')
	.directive('mydropzone', function (fileService) {
		return {
			templateUrl: 'views/myDropZone.html',
			restrict: 'E',
			link: function postLink(scope,element){

				//add a listener on onchange event, when a file is added in the system
				element.bind('change', function (event) {
					//vérifier la taille de files
					fileService.changeFile(element[0].firstChild.files[0]);
				});

			}
		};
	});