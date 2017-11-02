
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "partials/home.html",
    })
    .when("/photoDetail", {
        templateUrl : "partials/photo-result.html",
        controller : "PhotoResultCtrl"
    })
    .when("/login", {
        templateUrl : "partials/login.html",
        controller : "loginCtrl"
    })
    .when("/history", {
        templateUrl : "partials/history.html",
        controller : "HistoryCtrl"
    })     
    .otherwise({redirectTo:'/'});
});