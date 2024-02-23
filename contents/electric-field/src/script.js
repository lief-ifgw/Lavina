/////////////////////////////////
/*         CANVAS INFO         */

const canvasWidth = 500;
const canvasHeight = canvasWidth*0.75;
const panelHeight = canvasHeight;
const canvasField = document.getElementById("fieldCanvas");
canvasField.width = canvasWidth;
canvasField.height = canvasHeight;
var ctxField = canvasField.getContext('2d');


/////////////////////////////////
/*      ATRIBUIÇÃO DE IDS      */

let cargaCarga = document.getElementById("cargaCarga");
let btnMaisCarga = document.getElementById("btnMaisCarga");
let btnMenosCarga = document.getElementById("btnMenosCarga");
let btnNovaCarga = document.getElementById("btnNovaCarga");
let btnApagarCarga = document.getElementById("btnApagarCarga");


/////////////////////////////////
/*   DECLARAÇÃO DE VARIÁVEIS   */

let running = false;
var Interval;
let clicked = false;
let px = 20;
let r = px/2;
let chargeName = "";
let oX = 0;
let oY = 0;
let geradoraX = rand(0,canvasWidth);
let geradoraY = rand(canvasHeight,0);
let thick = 1;
let FUNCTIONS = [];
let BALLS = [];
const corr = 0; //fator de correção para o eixo y deformado

/////////////////////////////////
/*      CLASSES E FUNÇÕES      */

class Function {
    constructor(expression,color){
        this.expression = expression;
        this.color = color;
        FUNCTIONS.push(this);
    }

    adaptToGraph(){
        this.expression = ("(") + this.expression.replace(/x/g,"(x/px)") + (")*px");
    }
}

function rand(min, max){
    return Math.random() * (max-min) + min;
}

function round(n, precision){
    let factor = 10**precision;
    return parseFloat(Math.round(n*factor)/factor).toFixed(2);
}

function minPositive(oX,oY,px){
    let initx;
    let initY;
    if(oX % px === 0){
        initX = 0;
    }
    else{
        for(initX = oX; initX > px || initX < 0; initX -= px){
        }
    }

    if(oY % px === 0){
        initY = 0;
    }
    else{
        for(initY = oY; initY > px || initY < 0; initY -= px){
        }
    }
    return new Vector2D(initX, initY);
}

function changeCharge(charge,c){
    charge.m += c;
    calcField(BALLS, field, true);
    cargaCarga.innerText = charge.m;
}

function verifyPlayer(c, funct){
    BALLS.forEach(charge => {
        if(charge.player === true){
            funct(charge,c);
        }
    });
}

function onlyPlayer(carga){
    let ind = BALLS.indexOf(carga);
    BALLS.forEach(charge => {
        let comp = BALLS.indexOf(charge);
        if(comp != ind){
            charge.player = false;
        }
        else{
            charge.player = true;
        }
    });
}

btnMaisCarga.onclick = function(){
    verifyPlayer(1, changeCharge);
    
}

btnMenosCarga.onclick = function(){
    verifyPlayer(-1, changeCharge);
}

btnApagarCarga.onclick = function(){
    BALLS.forEach(charge => {
        if(charge.player === true){
            BALLS.splice(BALLS.indexOf(charge),1);
            calcField(BALLS,field,true);
        }
    });
}

btnNovaCarga.onclick = function(){
    console.log(BALLS);
    new Ball("charge",rand(r/2,canvasWidth-r/2),rand(canvasHeight-r/2,r/2),r,Math.round(rand(-1,1)));
    calcField(BALLS,field,true);
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

function moveCharge(i,mouse){
    let charge = BALLS[i];
    charge.pos.x = mouse.x;
    charge.pos.y = mouse.y;
    calcField(BALLS,field,true);
}
 
let clickPos = canvasField.addEventListener("mousedown", function (evt) {
    var mousePos = new Vector2D(getMousePos(canvasField, evt).x,getMousePos(canvasField, evt).y);

    BALLS.forEach(charge => {
        let dist = Vector2D.distance(mousePos,charge.pos); 
        if(dist <= 1.2*r){
            clicked = true;
            onlyPlayer(charge);
            chargeIndex = BALLS.indexOf(charge);
            cargaCarga.innerHTML = charge.m;
            console.log(charge);
        }
        else{
            charge.player = false;
        }
        
    });
}, false);


canvasField.addEventListener("mousemove", function (evt){
    if(clicked){
        mousePos = new Vector2D(getMousePos(canvasField, evt).x,getMousePos(canvasField, evt).y);
        moveCharge(chargeIndex, mousePos);
    }
})

canvasField.addEventListener("mouseup", function(evt){
    clicked = false;
})

function calcField(BALLS,field,grid){ //fazer com que múltiplas cargas criem um campo resultante
    ctxField.clearRect(0,0,canvasWidth,canvasHeight);
    if(grid === true){
        field.drawGrid(px,'lightgrey',1,0,0,'','',false);
    }
    let k = 9 * Math.pow(10,9); //constante de coulomb
    let eRes = new Vector2D(0,0);
    let e = [];
    let r = [];
    let rVersor = [];
    points = minPositive(oX,oY,px);
    for(pointsX = points.x; pointsX <= field.canvas.width; pointsX += px){
        for(pointsY = points.y; pointsY <= field.canvas.height; pointsY += px){
            let prova = new Vector2D(pointsX,pointsY-corr);
            BALLS.forEach(carga => {
                if(carga.pos.x != prova.x || carga.pos.y != prova.y){
                    if(carga.m > 0){
                        carga.drawBall(canvasField,"blue",false); //desenha a carga geradora
                    }
                    else if(carga.m < 0){
                        carga.drawBall(canvasField,"red",false); //desenha a carga geradora
                    }
                    else{
                        carga.drawBall(canvasField,"grey",false); //desenha a carga geradora
                    }
                    let i = BALLS.indexOf(carga);
                    e[i] = new Vector2D(0,0); //campo elétrico
                    r[i] = new Vector2D(0,0); //distância entre o ponto de prova e a carga geradora de campo
                    rVersor[i] = new Vector2D(0,0);
                    let cargaGrid = new Vector2D(carga.pos.x-oX,-1*(carga.pos.y-oY));
                    let provaGrid = new Vector2D(prova.x-oX,-1*(prova.y-oY));
                    r = Vector2D.subtract(provaGrid,cargaGrid); //distância entre o ponto de prova e a carga geradora de campo
                    rVersor = Vector2D.norma(r); //versor da distância
                    e[i] = Vector2D.scale(rVersor,k*carga.m/Math.pow(r.length(),2))
                }    
            });
            e.forEach(campo => {
                if(e.indexOf(campo) === 0){
                    eRes = campo;
                }
                else{
                    eRes = Vector2D.add(campo,eRes);
                }
            }); 
            let theta = eRes.angle();
            let lengthArrow = Vector2D.norma(eRes).length();


            //console.log(lengthArrow);
            let arr = new Arrow(prova,0.3*px,theta,"black"); //posição em relação ao canvas
            arr.draw(ctxField,invert = true);

        }
    } 

    
    // console.log("r: ",r); //relativo ao grid campo
    // console.log("angulo: ",theta); //relativo ao grid campo
    // console.log("e: ",e); //campo (módulo)
    // console.log("versor: ",rVersor); //direção relativa ao grid campo

}

/////////////////////////////////
/* CHAMADA DE MÉTODOS E OBJETOS*/ 

let field = new Graph(canvasField);

new Ball("charge1",geradoraX,geradoraY,r,1);
new Ball("charge2",rand(r/2,canvasWidth-r/2),rand(canvasHeight-r/2,r/2),r,-1);
new Ball("charge3",rand(r/2,canvasWidth-r/2),rand(canvasHeight-r/2,r/2),r,-1);
new Ball("charge4",rand(r/2,canvasWidth-r/2),rand(canvasHeight-r/2,r/2),r,0);
calcField(BALLS,field,true);
//charge1.drawBall(canvasField,"blue",false);
console.log(BALLS);
//if clicar em carga E mover, chamar calcField
//animateField();

/////////////////////////////////
/*
-input: características sobre o campo
    
*/