/**Les images base64 ont un header qui défini le type de l'image, google souhaite l'image sans ce header, on le supprime donc */
var base64WithoutHeader = base64_compress.replace(
    /^data:image\/(png|jpg|jpeg);base64,/,
    ""
  );