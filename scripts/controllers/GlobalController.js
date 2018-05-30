app.controller("GlobalCtrl", function($scope,$location,$route,angularService,webStorage,$rootScope) {
  /* Méthode applée par notre directive "camera" une fois la photo interceptée */
  $scope.getPhoto = function(photoPromise) {
    /** photoPromise est une méthode "déférée", qui une fois sont traitement réalisé, est notifié de sa promesse par le handler "then" ci dessous.
             * 
             * imgSrc : Notre photo en Base 64
             */
    photoPromise.then(function(imgSrc) {
      /** $rootScope est un $scope global, ce qui signifie que tous les controlleurs peuvent accéder et modifier la variable isLoading
                 * Ici, elle sert à montrer l'écran de chargement (dans index.html, un ng-show="isLoading" conditionne cet affichage).
                 */
      $rootScope.isLoading = true;

      var base64_compress = imgSrc;
      /**Les images base64 ont un header qui défini le type de l'image, google souhaite l'image sans ce header, on le supprime donc */
      var base64WithoutHeader = base64_compress.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );
      
      /** On appelle la méthode sendPicture de notre service */
      request = angularService
        .sendPicture(base64WithoutHeader)
        .then(function(data) {
          /** Le status correspond au code HTTP, 200 : ok
                         * 500 : erreur serveur
                         * 502 : Bad Gateway 
                         * 404 : Page not found
                         * ....
                         */
          if (data.status === 200) {
            /** On enregistre les infos de la photo dans notre variable du service **/

            angularService.photoTaken = data;
            /** On enregistre l'image pour l'afficher au dessus des résultats */
            angularService.photoTaken.base64Photo = base64_compress;
            /** On ajoute les infos de la photo dans notre historique */
            angularService.history.push(angularService.photoTaken);
            webStorage.set("history", angularService.history);
            
            /** On supprime notre cookie de la photo si il y en avait un */
            if (webStorage.has("photoTaken")) {
              webStorage.remove("photoTaken");
            }
            /** On remplace par la photo prise */
            webStorage.set("photoTaken", angularService.photoTaken);
            /** Si on est déjà sur la page de détail, on rafraichi pour que le changement se fasse */
            if ($location.path() === "/photoDetail") {
              $route.reload();
            } else {
              $location.path("photoDetail");
            }
            /*  On stoppe le chargement */
            $rootScope.isLoading = false;
          } else {
            //erreur
          }
        });
    });
  };
  /** Evenement déclanché à chaque changement de route (au clic sur un icone)
         * En fonction de la route, on active un icone et désactive les autres
         * Ce code est très moche et pourrait facilement être optimisé et clarifié ;)
         */
  $scope.$on("$routeChangeStart", function(next, current) {
    switch ($location.path()) {
      case "/":
        $scope.home = "enable";
        $scope.photo = "disable";
        $scope.user = "disable";
        break;
      case "/photoDetail":
        $scope.home = "disable";
        $scope.photo = "enable";
        $scope.user = "disable";
        break;
      case "/history":
        $scope.home = "disable";
        $scope.photo = "disable";
        $scope.user = "enable";
        break;
    }
  });

  /** Notre méthode prenant un chiffre à virgule et retournant l'arrondi en entier
           * Etant utilisée par 2 écrans (détail photo et history), il est judicieux de la placer dans notre controlleur principal
           */
  $scope.formatNumber = function(nb) {
    return Math.round(nb * 100);
  };

  $scope.translateText = function(textToTranslate){

    angularService.translateText(textToTranslate)
    .then(function(data){
        return data.data;
    })
     
  }


});
