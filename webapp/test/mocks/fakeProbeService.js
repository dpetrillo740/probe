'use strict';

SmartProbe.services.factory('fakeProbeService', ['$timeout', function ($timeout) {
  var obj = {};

  //constants
  var increaseIncrement = .05;

  obj.poll = function (onSuccess) {
    var result = null,
      temp1 = 70.2,
      temp2 = 75.4,
      time = new Date();

    var poller = function () {
      //create fake temp increase
      temp1 += (Math.random() + .5) * increaseIncrement;
      temp2 += (Math.random() + .5) * increaseIncrement;
      time = new Date();

      result = {
        temp1: temp1.toFixed(1),
        temp2: temp2.toFixed(1),
        time: time
      };

      onSuccess(result);

      $timeout(poller, 1000);

    };
    poller();

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
