'use strict';
var SmartProbe = {};

// Declare app level module which depends on filters, and services
angular.module('smartProbe', [
  'ngRoute',
  'smartProbe.filters',
  'smartProbe.services',
  'smartProbe.directives',
  'smartProbe.controllers',
  'ui.bootstrap',
  'ngAnimate',
  'googlechart'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'mainCtrl'});
  $routeProvider.when('/define-meat', {templateUrl: 'partials/define-meat.html', controller: 'defineMeatCtrl'});
  $routeProvider.when('/your-meat', {templateUrl: 'partials/your-meat.html', controller: 'yourMeatCtrl'});
  $routeProvider.when('/cooking', {templateUrl: 'partials/cooking.html', controller: 'cookingCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});

}]);

SmartProbe.services = angular.module('smartProbe.services', []);
SmartProbe.controllers = angular.module('smartProbe.controllers', []);