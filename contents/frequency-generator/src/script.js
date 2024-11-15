/////////////////////////////////
/*         CANVAS INFO         */

const canvasWidth = 300;
const canvasHeight = canvasWidth;
const panelHeight = canvasHeight;
const canvasWave = document.getElementById("waveCanvas"); 
canvasWave.width = canvasWidth;
canvasWave.height = canvasHeight;
var ctxWave = canvasWave.getContext('2d');


/////////////////////////////////
/*      ATRIBUIÇÃO DE IDS      */

// let xCoord = document.getElementById("xCoord");

/////////////////////////////////
/*   DECLARAÇÃO DE VARIÁVEIS   */


/////////////////////////////////
/*      CLASSES E FUNÇÕES      */


function rand(min, max){
    return Math.random() * (max-min) + min;
}

function round(n, precision){
    let factor = 10**precision;
    return parseFloat(Math.round(n*factor)/factor).toFixed(2);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

let clickPos = canvasWave.addEventListener("mousedown", function (evt) {
    var mousePos = new Vector2D(getMousePos(canvasWave, evt).x,getMousePos(canvasWave, evt).y);
    console.log(mousePos);
}, false);

/////////////////////////////////
/* CHAMADA DE MÉTODOS E OBJETOS*/ 



/////////////////////////////////
/*
*/