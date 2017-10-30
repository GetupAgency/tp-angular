app.controller('PhotoResultCtrl', function ($scope, $location, webStorage, angularService) {

 $scope.googleResult = angularService.requestPainting.data.responses[0].labelAnnotations;;
 $scope.pictureBase64 = angularService.requestPainting.base64Photo;

$scope.formatNumber = function(nb){
    return Math.round(nb * 100);
}
 
});