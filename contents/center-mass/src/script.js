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

let color = ['#5050FF','#FF5050','yellow'];
let displayCM  = document.getElementById("displayCM");
let resetCM = document.getElementById("resetCM");
let answerCM = document.getElementById("answerCM");
let ball1X = document.getElementById("b1x");
let ball1Y = document.getElementById("b1y");
let ball1M = document.getElementById("mb1");
let ball2X = document.getElementById("b2x");
let ball2Y = document.getElementById("b2y");
let ball2M = document.getElementById("mb2");
let ball3X = document.getElementById("b3x");
let ball3Y = document.getElementById("b3y");
let ball3M = document.getElementById("mb3");
let r1 = document.getElementById("r1");
let r2 = document.getElementById("r2");
let r3 = document.getElementById("r3");
let opt1 = document.getElementById("opt1");
let opt2 = document.getElementById("opt2");
let opt3 = document.getElementById("opt3");
let divCM = document.getElementById("cm");
let ansXCM = document.getElementById("ansXCM");
let ansYCM = document.getElementById("ansYCM");
let ansCM = document.getElementById("ansCM");

/////////////////////////////////
/*   DECLARAÇÃO DE VARIÁVEIS   */

let x = 100;
let y = 100;
let k = 0;
let rball = 15;
let friction = 0.1;
let xcm = 0;
let ycm = 0;
let px = 30;
let oX = 3*px;
let oY = canvasHeight - 3*px;
let labelX = "x (m)";
let labelY = "y (m)";
let clicked;
const BALLS = [];
const MASS = [];

/////////////////////////////////
/*      CLASSES E FUNÇÕES      */

function round(n, precision){
    let factor = 10**precision;
    return Math.round(n*factor)/factor;
}


function setLine(x0,y0,xf,yf,color,lw=1){
    ctx.beginPath();    
    ctx.moveTo(x0,y0);
    ctx.lineTo(xf,yf);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.closePath();
}

function drawX(cx, cy, l, t = 1){
    let k = l/(2*Math.sqrt(2));
    ctx.beginPath();
    ctx.moveTo(cx - k, cy + k);
    ctx.lineTo(cx + k, cy - k);
    ctx.strokeStyle = "black";
    ctx.lineWidth = t;
    ctx.stroke();
    ctx.moveTo(cx - k, cy - k);
    ctx.lineTo(cx + k, cy + k);
    ctx.strokeStyle = "black";
    ctx.lineWidth = t;
    ctx.stroke();
    ctx.closePath();
}

function massCenter(){
    xcm = 0;
    ycm = 0;
    for(i = 0; i < BALLS.length; i++){
        if(MASS.length <= 2){MASS.push(BALLS[i].m);}
        xcm += BALLS[i].m * BALLS[i].pos.x;
        ycm += BALLS[i].m * BALLS[i].pos.y;
    }
    let totalMass = MASS.reduce((p,c) => p + c, 0)
    xcm = xcm/totalMass;
    ycm = ycm/totalMass;
    totalMass = 0;
}

function cleanAnswer() {
    opt1.checked = false;
    opt2.checked = false;
    opt3.checked = false;
}

function mustAnswer() {
    window.alert("Você deve marcar uma opção para ver o resultado.");
}

function isAnswered() {
    if (opt1.checked === true || opt2.checked === true || opt3.checked === true) {
        return true;
    }
    else{
        return false;
    }
}

displayCM.onclick = function() {
    if (isAnswered()) {
        clicked = true;
        drawX(xcm,ycm,20,7);   
        divCM.classList.remove('hide');
        document.getElementById("cmX").innerHTML = xcm0;
        document.getElementById("cmY").innerHTML = ycm0; 
        let t = "X:"+xcm0+", Y:"+ycm0;
        for(i = 0; i < arrCM.length; i++){
            if(t === arrCM[i]){
                if(t === r1.innerHTML){
                    r1.className = "correct";
                    r2.className = "wrong";
                    r3.className = "wrong";
                }
                else if(t === r2.innerHTML){
                    r1.className = "wrong";
                    r2.className = "correct";
                    r3.className = "wrong";
                }
                else if(t === r3.innerHTML){
                    r1.className = "wrong";
                    r2.className = "wrong";
                    r3.className = "correct";
                }
            }
        }
    document.getElementById("myCanvas").focus();
    }
    else{
        mustAnswer();
    }
}

resetCM.onclick = function() {
    document.location.reload();
}

answerCM.addEventListener("click", function() {
    if(clicked){
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    }
    else{
        mustAnswer();
    }
});

/////////////////////////////////
/* CHAMADA DE MÉTODOS E OBJETOS*/ 

let graph1 = new Graph(canvas);
graph1.drawGrid(px,"lightgrey",1,oX,oY,labelX,labelY);
let ball1 = new Ball("ball1", rball+Math.random()*(canvasWidth-(2*rball)), rball+Math.random()*(canvasHeight-(2*rball)), rball, Math.ceil(Math.random()*9));
let ball2 = new Ball("ball2", rball+Math.random()*(canvasWidth-(2*rball)), rball+Math.random()*(canvasHeight-(2*rball)), rball, Math.ceil(Math.random()*9));
let ball3 = new Ball("ball3", rball+Math.random()*(canvasWidth-(2*rball)), rball+Math.random()*(canvasHeight-(2*rball)), rball, Math.ceil(Math.random()*9));

BALLS.forEach((b,index) => {
    b.drawBall(canvas,color[index],true);
});
massCenter();

let xcm0 = round(xcm - oX, 0);
let ycm0 = round((-1 * ycm) + oY, 0);
let arrCMX = [xcm0-Math.ceil(Math.random()*10),xcm0+Math.ceil(Math.random()*10),xcm0];
let arrCMY = [ycm0-Math.ceil(Math.random()*10),ycm0+Math.ceil(Math.random()*10),ycm0];
let arrCM = ["X:"+arrCMX[0]+", Y:"+arrCMY[0],"X:"+arrCMX[1]+", Y:"+arrCMY[1],"X:"+arrCMX[2]+", Y:"+arrCMY[2]];
arrCM = arrCM.sort(() => Math.random() - 0.5)
let ball1x = round(ball1.pos.x - oX, 0);
let ball3x = round(ball3.pos.x - oX, 0);
let ball2x = round(ball2.pos.x - oX, 0);
let ball1y = round((-1 * ball1.pos.y) + oY, 0); 
let ball2y = round((-1 * ball2.pos.y) + oY, 0);
let ball3y = round((-1 * ball3.pos.y) + oY, 0);
let ball1m = ball1.m;
let ball2m = ball2.m;
let ball3m = ball3.m;
let sumBallx = ball1x * ball1m + ball2x * ball2m + ball3x * ball3m;
let sumBally = ball1y * ball1m + ball2y * ball2m + ball3y * ball3m;
let sumMass = ball1m + ball2m + ball3m;
ball1X.innerHTML = ball1x;
ball2X.innerHTML = ball2x;
ball3X.innerHTML = ball3x;
ball1Y.innerHTML = ball1y;
ball2Y.innerHTML = ball2y;
ball3Y.innerHTML = ball3y;
ball1M.innerHTML = ball1m;
ball2M.innerHTML = ball2m;
ball3M.innerHTML = ball3m;
r1.innerHTML = arrCM[0];
r2.innerHTML = arrCM[1];
r3.innerHTML = arrCM[2];
ansXCM.innerHTML = "$\\LARGE{x_{cm} = \\frac{("+ball1x+")*("+ball1m+")+("+ball2x+")*("+ball2m+")+("+ball3x+")*("+ball3m+")}{"+ball1m+"+"+ball2m+"+"+ball3m+"}=\\frac{"+sumBallx+"}{"+sumMass+"}\\approx "+xcm0+"}$";
ansYCM.innerHTML = "$\\LARGE{y_{cm} = \\frac{("+ball1y+")*("+ball1m+")+("+ball2y+")*("+ball2m+")+("+ball3y+")*("+ball3m+")}{"+ball1m+"+"+ball2m+"+"+ball3m+"}=\\frac{"+sumBally+"}{"+sumMass+"}\\approx "+ycm0+"}$";
ansCM.innerHTML = "$\\large{("+xcm0+","+ycm0+")}$";
cleanAnswer();

