/////////////////////////////////
/*         CANVAS INFO         */

const canvasWidth = 600;
const canvasHeight = canvasWidth * 2 / 3;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');

/////////////////////////////////
/*      ATRIBUIÇÃO DE IDS      */


let sliderRaioObjeto = document.getElementById("sliderRObj");
let sliderVolumeFluido = document.getElementById("sliderVFluido");
let sliderDensidadeObjeto = document.getElementById("sliderPObj");
let sliderDensidadeFluido = document.getElementById("sliderPFluido");
let sliderViscosidadeFluido = document.getElementById("sliderViscFluido");
let labelVolumeObjeto = document.getElementById("Vobj");
let labelVolumeFluido = document.getElementById("Vfluido");
let labelDensidadeObjeto = document.getElementById("Pobj");
let labelDensidadeFluido = document.getElementById("Pfluido");
let labelViscosidadeFluido = document.getElementById("Viscfluido");
let btnPlay = document.getElementById("btnPlay");
let btnPause = document.getElementById("btnPause");


/////////////////////////////////
/*   DECLARAÇÃO DE VARIÁVEIS   */

const BALLS = [];
const WALLS = [];
let margemX = 20;
let margemYtop = 150;
let margemYbottom = 20;
let grossura = 5;
let raioObjeto = sliderRaioObjeto.value;
let volumeFluido = sliderVolumeFluido.value;
let densidadeObjeto = sliderDensidadeObjeto.value;
let densidadeFluido = sliderDensidadeFluido.value;
let alturaFluido;
let larguraFluido;
let comprimentoFluido;
let bolaX = canvasWidth/2;
let bolaY = canvasHeight/2;
let bolaM = densidadeObjeto * raioObjeto;
let b = new Ball("ball1", bolaX, bolaY, 10, bolaM);
let g = b.acceleration = 9.8;
let wallBottom = new Wall(margemX+grossura,canvasHeight-margemYbottom-grossura,canvasWidth-margemX-grossura,canvasHeight-margemYbottom-grossura);
let friction = 0;
let clicked = false;
let running = true;
btnPlay.disabled = true;

/////////////////////////////////
/*      CLASSES E FUNÇÕES      */

function round(n, precision){
    let factor = 10**precision;
    return Math.round(n*factor)/factor;
}


function freeze(animId) {
    if (running){
        cancelAnimationFrame(animId);
    }
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

function onlyPlayer(obj){
    let ind = BALLS.indexOf(obj);
    BALLS.forEach(obj => {
        let comp = BALLS.indexOf(obj);
        if(comp != ind){
            obj.player = false;
        }
        else{
            obj.player = true;
        }
    });
}

btnPause.onclick = function() {
    freeze(drawCanvas);
    running = false;
    btnPlay.disabled = false;
    btnPause.disabled = true;
}

btnPlay.onclick = function() {
    running = true;
    drawCanvas();
    btnPlay.disabled = true;
    btnPause.disabled = false;
}

let clickPos = canvas.addEventListener("mousedown", function (evt) {
    var mousePos = new Vector2D(getMousePos(canvas, evt).x,getMousePos(canvas, evt).y);

    BALLS.forEach(obj => {
        let dist = Vector2D.distance(mousePos,obj.pos); 
        if(dist <= 1.2*obj.r){
            clicked = true;
            onlyPlayer(obj);
            objIndex = BALLS.indexOf(obj);
            obj.v.x = 0;
            obj.v.y = 0;
        }
        else{
            obj.player = false;
        }
        
    });
}, false);

canvas.addEventListener("mouseup", function (evt) {
    clicked = false;
}, false);  


canvas.addEventListener("mousemove", function (evt) {
    if(clicked){
        var mousePos = new Vector2D(getMousePos(canvas, evt).x,getMousePos(canvas, evt).y);
        BALLS[objIndex].pos = mousePos;
    }
}, false);


function closestPointBW(obj1, w1){
    let ballToWallStart = Vector2D.subtract(w1.start,obj1.pos);
    if(Vector2D.dotProduct(w1.wallUnit(), ballToWallStart) > 0){
        return w1.start;
    }

    let wallEndToBall = Vector2D.subtract(obj1.pos,w1.end);
    if(Vector2D.dotProduct(w1.wallUnit(), wallEndToBall) > 0){
        return w1.end;
    }

    let closestDist = Vector2D.dotProduct(w1.wallUnit(), ballToWallStart);
    let closestVect = Vector2D.scale(w1.wallUnit(),closestDist);
    return Vector2D.subtract(w1.start,closestVect);
}


function collisionDetectionWall(obj1,w1){
    let ballClosest = Vector2D.subtract(closestPointBW(obj1,w1),obj1.pos);
    if(ballClosest.length() <= obj1.r){
        return true;
    }
}

function penetrationResultWall(obj1, w1){
    let penVect = Vector2D.subtract(obj1.pos,closestPointBW(obj1, w1));
    obj1.pos = Vector2D.add(obj1.pos, Vector2D.scale(Vector2D.norma(penVect),obj1.r-penVect.length()));
}

function collisionResultWall(obj1, w1){ 
    let normal = Vector2D.norma(Vector2D.subtract(obj1.pos,closestPointBW(obj1, w1)));
    let sepVel = Vector2D.dotProduct(obj1.v, normal);
    let new_sepVel = -sepVel * obj1.elasticity;
    let vsep_diff = sepVel - new_sepVel;
    obj1.v = Vector2D.add(obj1.v,Vector2D.scale(normal,-vsep_diff));
    obj1.v = Vector2D.scale(obj1.v,1-friction);
}

function volumeObjeto(raioObjeto) {
    return (4 / 3) * Math.PI * Math.pow(raioObjeto, 3);
}

function calcularEmpuxo(raioObjeto, densidadeFluido){
    return densidadeFluido * volumeObjeto(raioObjeto) * g;
}

function recipiente(){
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.fillRect(margemX, margemYtop, canvasWidth-2*margemX, canvasHeight-margemYtop-margemYbottom);
    ctx.closePath();
    ctx.clearRect(margemX+grossura, margemYtop, canvasWidth-2*margemX-2*grossura, canvasHeight-margemYtop-margemYbottom-grossura);
    }

function fluido(){
    ctx.fillStyle = "#48b0ff";
    volumeFluido = sliderVolumeFluido.value;
    alturaFluido = volumeFluido*9/4;
    ctx.fillRect(canvasWidth-margemX-grossura, canvasHeight-margemYbottom-grossura,-canvasWidth+2*margemX+2*grossura, -alturaFluido);

}
function calcularVolumeSubmerso(bola, alturaFluido) {
    const raio = bola.r;
    const yBola = canvasHeight-margemYbottom-grossura-bola.pos.y;
    const yTopoBola = yBola + raio;
    const yBaseBola = yBola - raio;
    const alturaSubmersa = alturaFluido - yBaseBola;
    console.log("Altura submersa: ", alturaSubmersa);
    //console.log(yBaseBola);
    let volumeBola = 4 / 3 * Math.PI * Math.pow(raio, 3);
    if (yTopoBola <= alturaFluido) {
        console.log("Bola totalmente submersa");
        return volumeBola; // Bola totalmente submersa
    } else if (yBaseBola >= alturaFluido) {
        console.log("Bola totalmente fora do fluido");
        return 0; // Bola totalmente fora do fluido
    } else{
        const volumeSubmerso = alturaSubmersa*alturaSubmersa*Math.PI*(raio - alturaSubmersa/3);
        return volumeSubmerso;
    }
}

function calcularForcaArrasto(viscosidade, raio, velocidade) {
    //return 6 * Math.PI * viscosidade * raio * velocidade;
}

function atualizarPosicaoBola(bola) {
    var densidadeFluido = sliderDensidadeFluido.value;
    var raioObjeto = sliderRaioObjeto.value;
    var densidadeObjeto = sliderDensidadeObjeto.value;
    var viscosidadeFluido = sliderViscosidadeFluido.value;

    labelDensidadeFluido.innerHTML = densidadeFluido;
    labelDensidadeObjeto.innerHTML = densidadeObjeto;
    labelRaioObjeto.innerHTML = raioObjeto;
    labelVolumeFluido.innerHTML = volumeFluido;
    labelViscosidadeFluido.innerHTML = viscosidadeFluido;
    //const alturaFluido = volumeFluido * 9 / 4; // Calcular altura do fluido
    const volumeSubmerso = calcularVolumeSubmerso(bola, alturaFluido);
    const empuxo = -1 * calcularEmpuxo(volumeSubmerso, densidadeFluido);
    const peso = -1 * densidadeObjeto * raioObjeto * g;
    const forcaArrasto = 0//calcularForcaArrasto(viscosidadeFluido, bola.r, bola.v.y);

    const forcaResultante = empuxo - peso - forcaArrasto; // Inclui força de arrasto
    bola.acceleration = forcaResultante / (densidadeObjeto * raioObjeto);
        //console.log("Força: ",forcaResultante, "Peso: ", peso, "Empuxo: ", empuxo, "Arrasto: ", forcaArrasto);
    
    if (clicked == false) {
        bola.v.y += bola.acceleration * 0.01;
        bola.pos.y += bola.v.y;
        //console.log("doc");
    }
    bola.drawBall(canvas, "#ff0000", false);
    if (collisionDetectionWall(b, wallBottom) == true) {
        penetrationResultWall(b, wallBottom);
        collisionResultWall(b, wallBottom);
    }
}


/////////////////////////////////
/* CHAMADA DE MÉTODOS E OBJETOS*/ 

function drawCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    recipiente();
    fluido();
    atualizarPosicaoBola(b);
    if (running){
        requestAnimationFrame(drawCanvas);
    }
}
drawCanvas();



