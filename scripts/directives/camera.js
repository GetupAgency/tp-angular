app.directive('camera', function ($q, ExifRestorer) {
    // Fix for chrome
    //noinspection JSUnresolvedVariable
    window.URL = window.URL || window.webkitURL;

    /**
     * Calculate scale factor
     *
     * @param memImg
     * @returns {number}
     */
    var calcXFactor = function (memImg) {
      maxSize = 800;
      if (memImg.width < maxSize && memImg.height < maxSize) {
        return 1;
      }

      return memImg.width > memImg.height ? maxSize / memImg.width : maxSize / memImg.height;
    };

    /**
     * Convert selected file for upload to some data URL
     * which we can set to src of any image tag
     *
     * @param files
     */
    var setPicture = function (files) {
      if (!(files.length === 1 && files[0].type.indexOf("image/") === 0)) {
        return;
      }
      console.log(files);
      // Promise for final image url to display and send to server
      var deferredImgSrc = $q.defer();
      // Promise for temp. memory image for resizing
      var memImgDefer = $q.defer();
      // Promise for file reader to read the original file data
      var binaryReaderDefer = $q.defer();

      var memImg = new Image();
      memImg.onload = function () {
        var imgCanvas = document.createElement("canvas"),
          imgContext = imgCanvas.getContext("2d");

        // Make sure canvas is as big as the picture
        var xfactor = calcXFactor(this);
        
        if(this.width > this.height){
          imgCanvas.width = 480;
          imgCanvas.height = (this.height * xfactor) >> 0;          
        }
        else {
          imgCanvas.width = (this.width * xfactor) >> 0;
          imgCanvas.height = 480;          
          
        }

        // Draw image into canvas element
        imgContext.drawImage(this, 0, 0, imgCanvas.width, imgCanvas.height);

        var targetImage = imgCanvas.toDataURL('image/jpeg', .9);

        // Send the resized image as promised
        memImgDefer.resolve(targetImage);
        memImg = null;
        imgCanvas = null;
        imgContext = null;
      };


      // Read image for exif
      var binaryReader = new FileReader();
      binaryReader.onloadend = function (e) {
        binaryReaderDefer.resolve(e.target.result);
      };

      //noinspection JSUnresolvedFunction
      memImg.src = URL.createObjectURL(files[0]);
      binaryReader.readAsDataURL(files[0]);

      $q.all([memImgDefer.promise, binaryReaderDefer.promise]).then(function (images) {
        var sourceImage = images[0];
        var targetImage = images[1];
        // Copy exif data
        ExifRestorer.restore(sourceImage, targetImage);

        deferredImgSrc.resolve(targetImage);
      });
      return deferredImgSrc.promise;
    };


    /**
     * Directive definition
     */
    return {
      restrict: 'E',
      template: '<input type="file" capture="camera" accept="image/*" id="camera"  style="visibility: hidden;position:absolute;width:200px;" />' +
      //'<div class="spinner spinner--center" ng-show="isLoading" ></div>'+
      '<a ng-click="takePhoto()">' +
      '<i class="flaticon-photo-camera"></i>' +
      '</a>'      ,
      scope: {
        onSelect: '&'
      },
      link: function ($scope, element, $rootScope) {
        var input = element.find('input');

        input.on('change', function (event) {
          
          $scope.onSelect({
            photo: setPicture(event.target.files)
          });
          //$scope.isLoading = false;
        });

        $scope.takePhoto = function () {
          input[0].click();
        };

      }
    }
  });