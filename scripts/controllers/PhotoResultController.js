app.controller('PhotoResultCtrl', function ($scope, $location, webStorage, angularService) {

 /**
  * On affecte à nos variables le contenu stocké dans notre service
  */   
 function init(lang){

    $scope.googleResult = angularService.photoTaken.data.responses[0].labelAnnotations;

    angular.forEach($scope.googleResult, function(lab){
        angularService.translateText(lab.description, lang)
        .then(function(data){
            lab.description_translated = data.data.data.translations[0].translatedText;
        })
    })

    $scope.pictureBase64 = angularService.photoTaken.base64Photo;
 }
init("fr");

  $scope.getCountries = function(){
    angularService.getListCountries()
    .then(function(data){
      
      $scope.countries = data.data.data.languages;

      $scope.countrySelected = "fr";

    })
  }
  $scope.getCountries();

  $scope.changeTranslation = function(){
      init($scope.countries.countrySelected);
  }
});