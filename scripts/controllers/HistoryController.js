app.controller('HistoryCtrl', function ($scope, $rootScope, $location, $routeParams, angularService, webStorage) {

    $scope.history = angularService.history;
});