app.factory('angularService', ['$q', '$rootScope', '$http', 'webStorage', function ($q, $rootScope, $http, webStorage) {
    /** On créé un objet vide, auquel nous allons ajouter propriétés et méthodes, qui seront injectées en entête des controlleurs (comme $q juste au dessus) */
    var SharedProfile = {};

    /** Si il y a un cookie history, on l'affecte à notre variable, sinon on l'initialise */
    SharedProfile.history = webStorage.has("history") ? webStorage.get("history") : [];

    /** Notre méthode d'envoi d'image à Google, appelée par n'importe quel controlleur ou directive implémentant le service 'angularService' */
    SharedProfile.sendPicture = function (base64) {
        /** On déclare une promesse, qui simule un thread, permettant de réaliser des appels HTTP sans bloquer l'experience utilisateur */
        var deferred = $q.defer();
        /** On utilise le module $http fourni par AngularJS, pour rappel, la convention CRUD autorise 4 verbes :
         * - Create -> POST
         * - Read -> GET
         * - Update -> PUT
         * - Delete -> DELETE
         */
        $http({
            method: "POST",
            // data est formatté comme Google le souhaite, plus d'info sur la doc de l'api Google Cloud Vision API
            data: '{"requests":[{"image":{"content":"' + base64 + '"},"features":[{"type":"LABEL_DETECTION","maxResults":5}]}]}',
            // Le contenu de l'url du service est déclaré dans notre fichier de config, pour la rendre réutilisable
            url: Config.urlService
            // L'appel s'est bien passé, notre "then" contient la réponse JSON de Google
        }).then(function (success) {
            // On notifie le controlleur appelant de la réponse obtenue
            deferred.resolve(success);
        }, function (error) {
        });
        return deferred.promise;
    };

    // Si une photo a été prise, on l'enregistre
    if (webStorage.has("photoTaken")) {
        SharedProfile.photoTaken = webStorage.get("photoTaken");
    }

    return SharedProfile;
}]);
