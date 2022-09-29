const canvasWidth = 600;
const canvasHeight = canvasWidth * 2 / 3;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');
document.getElementById("displayCM").checked = false;

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

let ball1 = new Ball("ball1", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, Math.ceil(Math.random()*9), 'blue');
let ball2 = new Ball("ball2", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, Math.ceil(Math.random()*9), 'red');
let ball3 = new Ball("ball3", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, Math.ceil(Math.random()*9), 'yellow');


drawGrid(gridX,gridY,'blue');
BALLZ.forEach((b, index) => {
    b.drawBall();
});

massCenter();

let xcm0 = round(xcm - pex * s, 0);
let ycm0 = round(-1 * ycm + pey * (Math.round(ySpaces)-s), 0);

function cm(){
    if(document.getElementById("displayCM").checked){
        drawX(xcm,ycm,20,7);   
        document.getElementById("cmX").innerHTML = xcm0;
        document.getElementById("cmY").innerHTML = ycm0; 
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





let arrCMX = [xcm0-1-Math.round(Math.random()*10),xcm0+Math.round(Math.random()*10),xcm0];
let arrCMY = [ycm0-Math.round(Math.random()*10),ycm0+Math.round(Math.random()*10),ycm0];
let arrCM = ["X:"+arrCMX[0]+", Y:"+arrCMY[0],"X:"+arrCMX[1]+", Y:"+arrCMY[1],"X:"+arrCMX[2]+", Y:"+arrCMY[2]];
arrCM = arrCM.sort(() => Math.random() - 0.5)
document.getElementById("b1x").innerHTML = round(ball1.pos.x - pex * s, 0);
document.getElementById("b1y").innerHTML = round(-1 * ball1.pos.y + pey * (Math.round(ySpaces)-s), 0);
document.getElementById("mb1").innerHTML = ball1.m;
document.getElementById("b2x").innerHTML = round(ball2.pos.x - pex * s, 0);
document.getElementById("b2y").innerHTML = round(-1 * ball2.pos.y + pey * (Math.round(ySpaces)-s), 0);
document.getElementById("mb2").innerHTML = ball2.m;
document.getElementById("b3x").innerHTML = round(ball3.pos.x - pex * s, 0);
document.getElementById("b3y").innerHTML = round(-1 * ball3.pos.y + pey * (Math.round(ySpaces)-s), 0);
document.getElementById("mb3").innerHTML = ball3.m;
document.getElementById("r1").innerHTML = arrCM[0];
document.getElementById("r2").innerHTML = arrCM[1];
document.getElementById("r3").innerHTML = arrCM[2];


function isAnswered() {
    if (opt1.checked === true || opt2.checked === true || opt3.checked === true) {
        return true;
    }
}

function cleanAnswer() {
    opt1.checked = false;
    opt2.checked = false;
    opt3.checked = false;
}

function mustAnswer() {
    alert("Você deve marcar uma opção para ver o resultado.");
}

