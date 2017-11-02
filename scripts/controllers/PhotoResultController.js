app.controller('PhotoResultCtrl', function ($scope, $location, webStorage, angularService) {

 /**
  * On affecte à nos variables le contenu stocké dans notre service
  */   
 $scope.googleResult = angularService.photoTaken.data.responses[0].labelAnnotations;
 $scope.pictureBase64 = angularService.photoTaken.base64Photo;


 
});