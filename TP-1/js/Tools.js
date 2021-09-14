
export { selectColor, selectRange, drawingWithPencil, cleanWithEraser, selectTargetCanvas };
"use strict";

// 1. Consigna 1: Barra de herramientas con, al menos, lápiz (que pueda elegir color del lápiz) y 
// goma de borrar, y su funcionalidad.
let canvas = document.getElementById("canvas");
function selectTargetCanvas(passcanvas) {
 canvas = passcanvas;
}
let ctx = canvas.getContext("2d");

// 1.0 Varibles:
// 1.1 Variable booleana que nos indica si el evento de dibujar se esta ejecutando:
let drawing = false; 

// 1.2  Colores para pintar y borrar:
let pencilColor = "black";
let cleanColor = "white";

// 1.3 Varible para manejar el grosor del lapíz:
let pencilWidth = "2";

// 1.4 Varible para manejar si se está dibujando o borrando:
let pencil = false;
let eraser = false;


// 2.0 Añadiendo eventos:
// 2.1 Toggle lapíz:
function drawingWithPencil(e) {
    // 2.1.1 Si la varible siempre se vuelve su contrario de su valor
    pencil = (!pencil);
    eraser = (false);
}

// 2.2 Toggle eraser: igual al lapíz
function cleanWithEraser(e) {
    eraser = (!eraser);
    pencil = (false);
}

// 3. Eventos para los inputs 
function selectRange(e) {
    e.preventDefault();
    pencilWidth = e.target.value ?? 1; // Añadiendo valor por defecto
}

function selectColor(e) {
    e.preventDefault();
    pencilColor = e.target.value ?? "#000000"; // Añadiendo valor por defecto
}

loadEvents()
// 4. Añadiendo eventos al canvas
function loadEvents() {
    canvas.addEventListener('mousedown', (e) => {draw(e)}, false);
    canvas.addEventListener('mousemove', (e) => {toDraw(e)}, false);
    canvas.addEventListener('mouseup', (e) => {stopDraw(e)}, false);
    canvas.addEventListener('mouseout', (e) => {stopDraw(e)}, false);
}

// 5. Método iniciar un trazar una linea (goma o lapíz):
function draw(e) {
    e.preventDefault();
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// 6. Método para unir puntos y formar una linea
function toDraw(e) {
    e.preventDefault();
    if(drawing == true){
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.strokeStyle = (pencil) ? pencilColor : 'white';
        ctx.lineWidth = pencilWidth;
        ctx.stroke();
    }
}

// 7. Método para parar de dibujar:
function stopDraw(e) {
    e.preventDefault();
    if (drawing == true) {
        ctx.closePath();
        drawing = false;
    }
}
