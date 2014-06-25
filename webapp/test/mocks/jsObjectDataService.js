'use strict';

SmartProbe.services.factory('jsObjectDataService', [function () {
  var obj = {};

  var savedObjects = {};
  var maxIds = {};

  obj.getById = function (path, id) {
    if (!savedObjects[path]) {
      return valueToPromise(undefined);
    }

    //get the object
    var theObject = savedObjects[path][id];

    return valueToPromise(theObject)
  };

  obj.save = function (path, value) {
    var id = generateId(path);

    //if this object type doesn't exist, create it
    if (!savedObjects[path]) {
      savedObjects[path] = {};
    }

    savedObjects[path][id] = value;
    return savedObjects[path];
  };

  var generateId = function (path) {
    var maxId = maxIds[path] || 0;
    maxId++;
    maxIds[path] = maxId;
    return maxId;
  };

  var valueToPromise = function (value) {
    var deferred = $q.defer();

    if (value) {
      deferred.resolve(value);
    }
    else {
      deferred.reject(value);
    }

    return deferred.promise;
  };

  return obj;

}]);
