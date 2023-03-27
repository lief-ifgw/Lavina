const canvasWidth = 500;
const canvasHeight = canvasWidth*0.75;
const panelHeight = 2*canvasHeight;

const canvasGraph = document.getElementById("myCanvas");
const canvasObject = document.getElementById("objectCanvas");
canvasObject.width = canvasWidth;
canvasObject.height = canvasHeight; 
canvasGraph.width = canvasWidth;
canvasGraph.height = canvasHeight;

var ctxGraph = canvasGraph.getContext('2d');
var ctxObject = canvasObject.getContext('2d');
document.getElementById("control-panel").style.height = panelHeight+"px";


let FUNCT = ["Math.pow(X,2)","Math.cos(X)","X*5 - 30"];//variável escrita como 'X', maiúsculo
let COLORFUNCT = ["green","blue","red"];
let zoomIn = document.getElementById("btnZoomIn");
let zoomOut = document.getElementById("btnZoomOut");
let btnStart = document.getElementById("btnStart");
let btnReset = document.getElementById("btnReset");
let xCoord = document.getElementById("xCoord");
let yCoord = document.getElementById("yCoord");
let px = 20;
let py = 20;
let oX = 3*px;
let oY = canvasHeight - 3*py;
let mouseX;
let mouseY;
let thick = 2;
let h = 0;


let graph1 = new Graph(canvasGraph);

document.onload = mainLoop();
document.onload = animate();

function animate() {
    animId = requestAnimationFrame(animate);
    mainLoop();
}

graph1.moveGraph();

function mainLoop() {
    h += 1;
    ctxGraph.save();
    ctxGraph.clearRect(0,0,canvasWidth,canvasHeight);
    graph1.plotFunction(px,py,FUNCT,COLORFUNCT,"#888888",thick);//usar 'X', e não 'x'
    ctxGraph.restore();
}

zoomIn.onclick = function(){
    if(px > 500 || py > 500){
    }
    else{
        px += 10;
        py += 10;
        thick += 0.2;
    }
}

zoomOut.onclick = function(){
    if(px <= 10 || py <= 10){
    }
    else{
        px -= 10;
        py -= 10;
        thick -= 0.2;
    }
}




canvasGraph.addEventListener("mousemove", function (evt) {
    var mousePos = getMouseCoord(canvasGraph, evt);
    xCoord.innerHTML = Math.round(((mousePos.x)/px)*100)/100;
    yCoord.innerHTML = Math.round(((mousePos.y)/py)*100)/100;
}, false);

function getMouseCoord(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left - oX,
        y: -1*(evt.clientY - Math.round(rect.top) - oY)
    };
}