'use strict';

SmartProbe.controllers.controller('appCtrl', ['$scope', function($scope) {
  $scope.isDefineMeatView = false;

  $scope.showDefineMeatView = function () {
    $scope.isDefineMeatView = true;
    window.location = './#/define-meat';
  };
}]);
