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


//let FUNCT = ["X+3"];
let zoomIn = document.getElementById("btnZoomIn");
let zoomOut = document.getElementById("btnZoomOut");
let funct = "Math.pow(X,2)- 2*X";
let functPrompt = document.getElementById("answer");
functPrompt.innerHTML = funct;
let px = 70;
let py = 70;
let oX = 100;
let oY = 300;
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
    graph1.plotFunction(px,py,funct,"green","#888888",thick);//usar 'X', e não 'x'
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
