'use strict';

SmartProbe.controllers.controller('defineMeatCtrl', ['$scope', 'meatDefinitionService', 'currentMeatDefinitionService', 'probeService',
  function($scope, meatDefinitionService, currentMeatDefService, probeService) {

  var setViewMode = function (viewMode) {
    $scope.viewMode = viewMode;

    switch(viewMode) {
      case 'view':
        $scope.actionText = 'Start Cooking';
        break;
      case 'edit':
        $scope.actionText = 'Define Your Meat';
        break;
      default:
        throw('viewMode ' + viewMode + ' not defined');
    }
  };

  var scope_ToMeatDef = function () {
    var meatDefinition = _.pick($scope, 'targetEndTemp', 'methodOfCooking', 'heatSourceTemp', 'meatMass', 'meatShape', 'meatThickness');
    return meatDefinition;
  };

  //set defaults
  setViewMode('edit');
  //TODO: instead of defaults, get from server
  $scope.targetEndTemp = 180;
  $scope.methodOfCooking = 'Grilled';
  $scope.heatSourceTemp = 350;
  $scope.meatMass = 3000;
  $scope.meatShape = 'Bird-like';
  $scope.meatThickness = 3;
  
  $scope.submitMeatDefinition = function () {
    var meatDefinition = scope_ToMeatDef();
    meatDefinitionService.save(meatDefinition);
    currentMeatDefService.save(meatDefinition)
      .then(function () {
        window.location = './#/your-meat'
      });
  };

  $scope.startCooking = function () {
    var meatDefinition = scope_ToMeatDef();
    probeService.post(meatDefinition)
      .then(window.location = './#/cooking.html');
  };



}]);

