'use strict';

SmartProbe.controllers.controller('yourMeatCtrl', ['$scope', 'currentMeatDefinitionService', function($scope, currentMeatDefService){
  currentMeatDefService.get().then(function (response) {
    //todo: have service return data instead of response, use interceptor?

    var currentMeat = response.data;
    $scope.targetEndTemp = currentMeat.targetEndTemp;
    $scope.methodOfCooking = currentMeat.methodOfCooking;
    $scope.heatSourceTemp = currentMeat.heatSourceTemp;
    $scope.meatMass = currentMeat.meatMass;
    $scope.meatShape = currentMeat.meatShape;
    $scope.meatThickness = currentMeat.meatThickness;
  });

}]);
