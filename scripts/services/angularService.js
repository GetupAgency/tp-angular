app.factory('angularService', ['$q', '$rootScope', '$http', 'webStorage', function ($q, $rootScope, $http, webStorage) {

    var SharedProfile = {};

    if(webStorage.has("history")){
        SharedProfile.history = webStorage.get("history");
    }
    else {
        SharedProfile.history = [];
    }

    angular.forEach(SharedProfile.history, function(his){
        console.log(his);
    });

    SharedProfile.sendPicture = function (base64) {

        var deferred = $q.defer();
        $http({
            method: "POST",
            data: '{"requests":[{"image":{"content":"' + base64 + '"},"features":[{"type":"LABEL_DETECTION","maxResults":5}]}]}',
            url: Config.urlService
        }).then(function (success) {
            deferred.resolve(success);
        }, function (error) {
        });
        return deferred.promise;
    };

    
    if (webStorage.has("currentPainting")) {
        SharedProfile.requestPainting = webStorage.get("currentPainting");
    }

    return SharedProfile;
}]);
