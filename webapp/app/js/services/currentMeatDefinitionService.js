'use strict';

//TODO: actually implement
SmartProbe.services.factory('currentMeatDefinitionService', ['$http', '$q', function ($http, $q) {
  var obj = {};

  var currentMeatDef = null;

  obj.get = function() {
    return $http.get('/api/currentMeatDefs');
  };

  obj.save = function (meatDefinition) {
    return $http.put('/api/currentMeatDefs', meatDefinition);
  };

  return obj;
}]);