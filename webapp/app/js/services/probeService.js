'use strict';

SmartProbe.services.factory('probeService', ['$http', function ($http) {
  var obj = {};

  obj.post = function (meatDefinition) {
    var url = 'https://api.spark.io/v1/devices/50ff6b065067545643400387/cook?access_token=21b88a533a33b4d7d750ea2b5b2429bffab54b7f';

    var postString = 'args: '
      + meatDefinition.targetEndTemp + ', '
      + meatDefinition.methodOfCooking + ', '
      + meatDefinition.heatSourceTemp + ', '
      + meatDefinition.meatMass + ', '
      + meatDefinition.meatShape + ', '
      + meatDefinition.meatThickness;


    var resultPromise = $http.post(url, postString, {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });

    return resultPromise;
  };

  obj.poll = function () {
    var url = 'https://api.spark.io/v1/devices/50ff6b065067545643400387/cook?access_token=21b88a533a33b4d7d750ea2b5b2429bffab54b7f';
    var result = null;

    var poller = function () {
      $http.get(url)
        .then(function(response) {
          result = response;
          $timeout(poller, 1000);
      });
    };

    poller();

    return result;
  };

  return obj;
}]);
