'use strict';

SmartProbe.services.factory('formattingService', [function () {
  var obj = {};

  obj.getFormattedTime = function(milliseconds) {
    var duration = moment.duration(milliseconds);
    var days = duration.days();
    var hours = duration.hours();
    var minutes = duration.minutes();
    var seconds = duration.seconds();

    var daysString = (days)
      ? days + 'Days '
      : '';

    var hoursString = (hours)
      ? getTwoDigitNumber(hours) + ':'
      : '00:';

    var minutesString = (minutes)
      ? getTwoDigitNumber(minutes) + ':'
      : '00:';

    var secondsString = (seconds)
      ? getTwoDigitNumber(seconds)
      : '00';

    return daysString + hoursString + minutesString + secondsString;
  };

  var getTwoDigitNumber = function(val) {
    if (parseInt(val) > 99) {
      throw('Value: ' + val.toString() + ' cannot be greater than 99.');
    }

    var valString = val.toString();
    return ("0" + (+valString + 1)).slice(-2);
  };

  return obj;
}]);
