'use strict';

/**
 * @ngdoc overview
 * @name MaryTTSHTMLFrontEnd
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('MaryTTSHTMLFrontEnd', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
