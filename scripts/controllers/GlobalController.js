  app.controller('GlobalCtrl', function($scope, $location, $route ,angularService, webStorage, $rootScope) {
   
    
    /**Camera*/
    
        $scope.getPhoto = function (photoPromise) {

            photoPromise.then(function (imgSrc) {
                $rootScope.isLoading = true;
                    var base64_compress = imgSrc;
                    var base64WithoutHeader = base64_compress.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                    
                    request = angularService.sendPicture(base64WithoutHeader).then(function(data){
                        if(data.status === 200){
                          data.base64Photo = base64_compress;
                          angularService.requestPainting = data;
                          
                          angularService.history.push(data);
                          webStorage.set("history", angularService.history);
                          








                          if(webStorage.has("currentPainting")){
                            webStorage.remove("currentPainting");
                         }
                          webStorage.set("currentPainting", angularService.requestPainting);
    
                          if($location.path() === "/paintingDescription"){
                              $route.reload();
                          }else{
                              $location.path("paintingDescription");
                          }
                          $rootScope.isLoading = false;
                          
                        }else{
                            //erreur
                        }
                        
                      });
                    
                

                    });
        }
        $scope.$on('$routeChangeStart', function(next, current) { 
            switch($location.path()){
                case "/":
                    $scope.home = "enable";
                    $scope.photo = "disable";
                    $scope.user = "disable";
                    break;
                case "/paintingDescription":
                    $scope.home = "disable";
                    $scope.photo = "enable";
                    $scope.user = "disable";
                    break;
                case "/login":
                    $scope.home = "disable";
                    $scope.photo = "disable";
                    $scope.user = "enable";
                    break;
                case "/recommendation":
                    $scope.home = "disable";
                    $scope.photo = "disable";
                    $scope.user = "enable";
                    break;
            }
          });
    
        $scope.changePath = function($i){
            switch($i) {
                case 1:
                    $location.path("/");
                    break;
                case 3:
                    $location.path("history");
                    break;
                case 4:
                    $location.path("recommendation");                
                    break;
            }
        }
    
  });