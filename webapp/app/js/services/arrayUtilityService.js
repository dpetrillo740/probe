'use strict';

SmartProbe.services.factory('arrayUtilityService', [function () {
  var obj = {};

  obj.reduceByPercent = function(array, percent) {
    if (percent < 0 || percent > 100) {
      throw('percent: ' + percent + ' must be between 0 and 100.')
    }

    var originalLength = array.length;
    var reduceIncrement = 100 / percent;

    for(var i = reduceIncrement; i < originalLength; i+= reduceIncrement) {
      //-1 because arrays are zero-indexed
      var positionToRemove = parseInt(i) - 1;
      array.splice(positionToRemove, 1);

      //subtract one from i to "move it back" a position int he array, since we just removed an element
      i--;
    }

    return array;
  };

  return obj;
}]);

