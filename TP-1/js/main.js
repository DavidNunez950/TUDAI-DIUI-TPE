
// Consigna 1: Módulo que contiene las funcionalidades del lápiz y goma:
import {  selectColor, selectRange, drawingWithPencil, cleanWithEraser, selectTargetCanvas  } from './Tools.js';

// Consigna 2 y 5: Módulo que contiene las funciones para subir una imagen y descargarla al disco
import { uploadImage, downloadImage } from"./ImageLoader.js";

// Consigna 3 y 4: Módulo que contiene los filtros
import { ImageFilters } from "./ImageFilter.js"; 
document.addEventListener("DOMContentLoaded", ()=> {
    const canvas =  document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width  = 0;
    canvas.height = 0;

    // Funciones para ajustar el tamaño del canvas:
    window.addEventListener('resize', resize);

    function resize() {
        canvas.maxWidth  = innerWidth  - canvas.parentElement.offsetLeft  - 65;
        canvas.maxHeight = innerHeight - canvas.parentElement.offsetTop   - 15;
        if(canvas.width === 0 || canvas.height === 0) {
            canvas.width  = canvas.maxWidth;
            canvas.height = canvas.maxHeight;
        } else {
            adjustAspectRatio(canvas)
        }
    }

    function adjustAspectRatio(object) {
        canvas
        let imgAscpectRatio = object.width / object.height; 
        let cavasAscpectRatio = canvas.maxWidth / canvas.maxHeight; 
        let coefficient  = (cavasAscpectRatio > imgAscpectRatio) ? canvas.maxHeight / object.height : canvas.maxWidth / object.width;
        canvas.width  *= coefficient;
        canvas.height *= coefficient;
        console.log(canvas.height)
    }

    resize();
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    // Consigna 1: 
    selectTargetCanvas(canvas)
    // 2.0 Añadiendo eventos:
    // 2.1 Toggle lapíz:
    document.getElementById('lapiz').addEventListener('click', (e)=> { drawingWithPencil(e) })

    // 2.2 Toggle eraser: igual al lapíz
    document.getElementById('goma').addEventListener('click', (e)=> { cleanWithEraser(e) });

    // 3. Eventos para los inputs 
    document.getElementById('grosor').addEventListener('change', (e)=> { selectRange(e) })

    document.getElementById('color').addEventListener('change', (e)=> { selectColor(e) })

    // Consigna 2:
    // Añadiendo eventos para subir una imagen
    document.getElementById('btn-download-image').addEventListener('click', (e) => {
        // Pasando el elemento HTML del evento
        downloadImage(e.target, canvas)
      })

    // Consigna 5:
    // Añadiendo eventos para descargar una imagen
    document.getElementById('btn-upload-image').addEventListener("change", (e) => {
        // Pasando el elemento HTML del evento
        uploadImage(e.target, canvas)
    });


    // Consigna 3 y 4:
    // Añadiendo los eventos para activar los filtros
    document.getElementById("inputFilter").addEventListener("submit", (e) => {
        e.preventDefault();
        
        // 1. Seleccionando el formulario HTML que contiene los filtros 
        // Creación de una cpia del canvas
        let inputsFilters = e.target;
        let inputImagen  = ctx.getImageData(canvas.clientLeft, canvas.clientTop, canvas.width, canvas.height);
        
        // 2.1.0 Seleccionando los inputs tipo rango
        inputsFilters.querySelectorAll("input[type=range]").forEach( input => {
            
            // 2.1.1 El nombre dela función de un filtro particular, se guarda en su respectivo input
            // en un atributo con nombre "data-filter-type" 
            let filter = input.getAttribute("data-filter-type");

            // 2.1.2 Se recupera el valor del rango
            let intensity = input.value ?? 0;

            // 2.1 En caso de que la intensidad, el valor del rango, no sea mayor a 0, no se
            // llaman a los filtros
            if(intensity > 0) {
                // 2.1.3 Se crea una nueva copia del canvas "outputImagen", esto para no editar la misma
                // imagen de la cual se está obteniendo la información para aplicar los filtros
                let outputImagen = ctx.getImageData(canvas.clientLeft, canvas.clientTop, canvas.width, canvas.height);
                
                // 2.1.4 Utilizando la variable "filter" que contiene el nombre del método, se llama 
                // a su respectivo método, pasando las variables correspondientes
                // 2.1.5 Se iguala el valor de la variable "inputImagen" al valor de retorno de la función de un filtro, 
                // a pesar de que la misma función retorna la variable "outputImagen", la cual ya contiene los efectos de los
                // los filtros aplicados. Esto se hace con la razón de poder aplicar filtros consecutivos
                // sobre la misma imagen
                inputImagen = ImageFilters[filter](inputImagen, outputImagen, intensity);
            }
        });
        
        // 2.2.1 Análogo a los pasos previos, pero adaptado a los inputs tipo checkbox
        inputsFilters.querySelectorAll("input[type=checkbox]:checked").forEach( input => {
                let outputImagen = ctx.getImageData(canvas.clientLeft, canvas.clientTop, canvas.width, canvas.height);
                let filter = input.getAttribute("data-filter-type")
                inputImagen = ImageFilters[filter](inputImagen, outputImagen);
        });

        // 3. Se coloca la imagen editada en el canvas
        ctx.putImageData(inputImagen, canvas.clientLeft, canvas.clientTop);
    });
});

