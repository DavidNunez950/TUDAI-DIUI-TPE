export { uploadImage, downloadImage };

// Consigna 2: función para cargar una imagen del disco al canvas
function uploadImage(uploadBtn, canvas) {
    // 1. verificar is el atributo "files" del input de tipo file
    // no está iniciliazado o no tiene ningún archivo cargado
    if (!uploadBtn.files || !uploadBtn.files[0]) return;

    // 2. Instanciando objecto FileReader, el cual permite leer archivos seleccionados 
    // por el usuario de forma asincronica
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {

        // 3. Se crea una instancia de la clase "Image" y utilizando la
        // propiedad "onload", se le agrega un evento que se agregue cuando termine de cargarse
        const img = new Image();
        img.onload  = () => {
            let imgAscpectRatio = img.width / img.height; 
            let cavasAscpectRatio = canvas.maxWidth / canvas.maxHeight; 
            let coeficiente = (cavasAscpectRatio > imgAscpectRatio) ? canvas.maxHeight / img.height : canvas.maxWidth / img.width;
            img.width  *= coeficiente;
            img.height *= coeficiente;
            canvas.width  = img.width ; 
            canvas.height = img.height; 
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
        };

        // 4. Se setea el atributo "src" con el atributo "result" de la instancia "fileReader"
        // el cual contiene el archivo subido, en un formatea en particular, el cual, como se puede 
        // ver más adelante es un "Datos URIs" (traducción aproximada)
        img.src = fileReader.result;
    });
    //  5. Una vez instanciado el "FileReader" y definido que tiene que hacer cuando 
    // termine de leer el archivo del disco, utilizando el sumétodo "readAsDataURL", el cual permite
    // transformar archivos en "Datos URIs", que permiten incorporar pequeños archivos en líneas 
    // de texto
    fileReader.readAsDataURL(uploadBtn.files[0]);
  }

// Consigna 5: función para descargar una imagen al disco desde el canvas
function downloadImage(downloadBtn, canvas) {

    // 1. Al botón de descargas se le setea un atributo download
    // para que al hacer clic no se redirija a una página nueva para descargar el archivo
    // y se le da un nombre al archivo para cuando se haya descargado
    downloadBtn.setAttribute("download","canvas.png");

    // 2. Se obtiene los "Datos URIs" del canvas y se los setea en el atributo "href" del link.
    let image = canvas.toDataURL("image/png");
    downloadBtn.setAttribute("href", image);
}