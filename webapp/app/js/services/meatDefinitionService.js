'use strict';

SmartProbe.services.factory('meatDefinitionService', ['jsObjectDataService', function (dataService) {
  var obj = {};

  obj.get = function (id) {
    return dataService.getById(id);
  };

  obj.getLatest = function () {
    return dataService.getLatest();
  };

  obj.save = function (value) {
    dataService.save('meatDefinitions', value);
  };

  return obj;
}]);