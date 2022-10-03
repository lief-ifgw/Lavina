const canvasWidth = 600;
const canvasHeight = canvasWidth * 2 / 3;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');


let checkboxCM  = document.getElementById("displayCM");
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

checkboxCM.checked = false;
let x = 100;
let y = 100;
let k = 0;
let friction = 0.1;
let xcm = 0;
let ycm = 0;
let gridX = 30;
let gridY = 30;
const BALLZ = [];
const WALLZ = [];
const MASS = [];


let UP, DOWN, LEFT, RIGHT;

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

function drawGrid(px,py,color){
    s = 2;
    pex = px;
    pey = py;
    xSpaces = canvasWidth/px;
    ySpaces = canvasHeight/py;
    for(i = 1; i < xSpaces; i++){
        if(i === s){
            setLine(px*i,0,px*i,canvasHeight,'black',3);    
        }
        else{
            setLine(px*i,0,px*i,canvasHeight,color);
        }
    }
    for(i = 1; i < ySpaces; i++){
        if(i === Math.round(ySpaces) - s){
            setLine(0,py*i,canvasWidth,py*i,'black',3);    
        }
        else{
            setLine(0,py*i,canvasWidth,py*i,color);
        }
    }
}

function massCenter(){
    xcm = 0;
    ycm = 0;
    for(i = 0; i < BALLZ.length; i++){
        if(MASS.length <= 2){MASS.push(BALLZ[i].m);}
        xcm += BALLZ[i].m * BALLZ[i].pos.x;
        ycm += BALLZ[i].m * BALLZ[i].pos.y;
    }
    let totalMass = MASS.reduce((p,c) => p + c, 0)
    xcm = xcm/totalMass;
    ycm = ycm/totalMass;
    totalMass = 0;

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

let ball1 = new Ball("ball1", Math.random()*canvasWidth, Math.random()*canvasHeight, 15, Math.ceil(Math.random()*9), '#5050FF');
let ball2 = new Ball("ball2", Math.random()*canvasWidth, Math.random()*canvasHeight, 15, Math.ceil(Math.random()*9), '#FF5050');
let ball3 = new Ball("ball3", Math.random()*canvasWidth, Math.random()*canvasHeight, 15, Math.ceil(Math.random()*9), 'yellow');


drawGrid(gridX,gridY,'blue');
BALLZ.forEach((b, index) => {
    b.drawBall();
});

massCenter();

let xcm0 = round(xcm - pex * s, 0);
let ycm0 = round(-1 * ycm + pey * (Math.round(ySpaces)-s), 0);

let arrCMX = [xcm0-1-Math.round(Math.random()*10),xcm0+Math.round(Math.random()*10),xcm0];
let arrCMY = [ycm0-Math.round(Math.random()*10),ycm0+Math.round(Math.random()*10),ycm0];
let arrCM = ["X:"+arrCMX[0]+", Y:"+arrCMY[0],"X:"+arrCMX[1]+", Y:"+arrCMY[1],"X:"+arrCMX[2]+", Y:"+arrCMY[2]];
arrCM = arrCM.sort(() => Math.random() - 0.5)

ball1X.innerHTML = round(ball1.pos.x - pex * s, 0);
ball1Y.innerHTML = round(-1 * ball1.pos.y + pey * (Math.round(ySpaces)-s), 0);
ball1M.innerHTML = ball1.m;
ball2X.innerHTML = round(ball2.pos.x - pex * s, 0);
ball2Y.innerHTML = round(-1 * ball2.pos.y + pey * (Math.round(ySpaces)-s), 0);
ball2M.innerHTML = ball2.m;
ball3X.innerHTML = round(ball3.pos.x - pex * s, 0);
ball3Y.innerHTML = round(-1 * ball3.pos.y + pey * (Math.round(ySpaces)-s), 0);
ball3M.innerHTML = ball3.m;
r1.innerHTML = arrCM[0];
r2.innerHTML = arrCM[1];
r3.innerHTML = arrCM[2];


function isAnswered() {
    if (opt1.checked === true || opt2.checked === true || opt3.checked === true) {
        return true;
    }
    else{
        return false;
    }
}

function cleanAnswer() {
    opt1.checked = false;
    opt2.checked = false;
    opt3.checked = false;
}

function mustAnswer() {
    window.alert("Você deve marcar uma opção para ver o resultado.");
    checkboxCM.checked = false;
}

function cm(){
    if(isAnswered()){
        if(checkboxCM.checked){
            drawX(xcm,ycm,20,7);   
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
        }
        else{
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawGrid(gridX, gridY,'blue');
            BALLZ.forEach((b, index) => {
                b.drawBall();
            });
            document.getElementById("cmX").innerHTML = '';
            document.getElementById("cmY").innerHTML = ''; 
        }
        document.getElementById("myCanvas").focus();
    }
    else{
        mustAnswer();
        
    }
}

 cleanAnswer();
