'use strict';

SmartProbe.services.factory('fakeMeatDonenessService', [function () {
  var obj = {};

  var theHeatSourceTemp,
    startingMeatTemp,
    theStartTime,
    theTargetEndTemp,
    areInitialValuesSet = false;

  obj.setInitialValues = function (heatSourceTemp, initialMeatTemp, startTime, targetEndTemp) {
    theHeatSourceTemp = heatSourceTemp;
    startingMeatTemp = initialMeatTemp;
    theStartTime = startTime;
    theTargetEndTemp = targetEndTemp;
    areInitialValuesSet = true;
  };

  obj.getEstimatedMillisecondsUntilDone = function (meatTemp, currentTime) {
    if (!areInitialValuesSet) {
      throw('the "setInitialValues" function must be called before this function is called.');
    }

    var timeDiff = currentTime.getTime() - theStartTime.getTime();
    var temperatureDiff = meatTemp - startingMeatTemp;

    var millisecondsToIncreaseOneDegree = timeDiff / temperatureDiff;
    var temperatureLeftToIncrease = theTargetEndTemp - meatTemp;

    return temperatureLeftToIncrease * millisecondsToIncreaseOneDegree;
  };

  return obj;
}]);
