app.controller('HistoryCtrl', function ($scope, $rootScope, $location, $routeParams, angularService, webStorage, $route) {
    /** On affecte à notre scope le contenu de la variable history du service */
    $scope.history = angularService.history;

    /** Pour remettre à 0 notre historique, on supprime l'entrée dans le webstorage, la variable du service, et on raffraichi */
    $scope.resetHistory = function(){
        webStorage.remove("history");
        angularService.history = [];
        $route.reload();
    };
});