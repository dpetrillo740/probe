'use strict';

SmartProbe.controllers.controller('cookingCtrl', ['$scope', 'fakeProbeService', 'currentMeatDefinitionService', 'arrayUtilityService', 'fakeMeatDonenessService', 'formattingService',
  function ($scope, probeService, meatDefService, arrayUtilService, meatDonenessService, formattingService) {
    $scope.readings = {};

    //get current meat def
    meatDefService.get().then(function (response) {
      var currentMeat = response.data;
      $scope.currentMeat = currentMeat;

      pollTemperatures(currentMeat);
    });

    function pollTemperatures(currentMeat) {
      //poll probe temperatures
      var isfirstProbePoll = true;
      var maxDisplayedTemp = 0;
      var millisecondsUntilDone = 0;
      probeService.poll(function (result) {

        if (isfirstProbePoll) {
          //setup meat doneness service
          meatDonenessService.setInitialValues(currentMeat.heatSourceTemp, result.temp1, new Date(), currentMeat.targetEndTemp);

          maxDisplayedTemp = parseInt(currentMeat.targetEndTemp) * 1.2;
          var minDisplayedTemp = parseInt(result.temp1) * .8;
          initTemperatureGraph(minDisplayedTemp, maxDisplayedTemp);
          isfirstProbePoll = false;
        }

        $scope.temp1 = result.temp1 + '°';

        //update graph data
        if (parseInt(result.temp1) < maxDisplayedTemp) {
          updateGraph(result);
        }

        //update estimated time of meat completion
        millisecondsUntilDone = meatDonenessService.getEstimatedMillisecondsUntilDone(result.temp1, new Date());
        $scope.estimatedTimeLeft = formattingService.getFormattedTime(millisecondsUntilDone);
      });
    }

    function initTemperatureGraph(minTemp, maxTemp) {
      //TODO: move graphing to a service or directive
      //temperature graph
      $scope.temperatureGraph = {
        type: 'LineChart',
        options: {
          lineWidth: 3,
          series: { 0: {targetAxisIndex: 0, visibleInLegend: false, pointSize: 0, lineWidth: 0},
            1: {targetAxisIndex: 1},
            2: {targetAxisIndex: 1}
          },
          vAxes: {
            0: {textPosition: 'none', gridlines: { count: 0 }},
            1: {
              viewWindowMode: 'explicit',
              viewWindow: {
                max: maxTemp,
                min: minTemp
              },
              format: '#,###.#°'
            }
          }
        },
        data: {
          //need a dummy column in order to right-align the h-axis (meat temps)
          "cols": [
            {id: "time", label: "Cooking Time", type: "datetime"},
            {id: "dummy", label: null, type: "number"},
            {id: "temp1", label: "Meat Temperature", type: "number" }
          ]
        }
      };

      $scope.temperatureGraph.data.rows = [];
    }

    function updateGraph(currentProbeReading) {
      $scope.temperatureGraph.data.rows.push({
        "c": [
          { "v": currentProbeReading.time },
          { "v": null },
          { "v": currentProbeReading.temp1 }
        ]
      });

      //TODO: deal with this some other way.  This is currently here to alleviate the chart from taking up a crazy amount of memory over time
      if ($scope.temperatureGraph.data.rows.length > 100) {
        arrayUtilService.reduceByPercent($scope.temperatureGraph.data.rows, 25);
      }
    }



  }]);
