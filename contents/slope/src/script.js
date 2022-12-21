const canvasWidth = 600;
const canvasHeight = 400;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');

let btnStart = document.getElementById("btnStart");
let btnReset = document.getElementById("btnReset");
let btnConfirm = document.getElementById("btnConfirm");
let valor = document.getElementById("valor");
let xpos = document.getElementById("xpos");
let ypos = document.getElementById("ypos");
let formSlope = document.getElementById("formSlope");
let ansSlope = document.getElementById("ansSlope");
let clicked;
let running = false;
let animId;
let x = 100;
let y = 100;
const g = 0.15;
let friction = 0;
let xcm = 0;
let ycm = 0;
let rball = 10;
let ang = rand(1.8*Math.PI,2*Math.PI);
let new_rad = Math.abs(ang - 2*Math.PI);
let wx2 = canvasWidth - 6*rball;
let wy2 = canvasHeight - 3*rball;
let wx1 = wx2 + 2*rball - wx2*Math.cos(ang); 
let wy1 = wy2 + wx2*Math.sin(ang);

const BALLS = [];
const WALLS = [];
let wallBottom;
let wallLeft;
let wallRight;

let b = new Ball("ball1", wx1 + Math.cos(ang)*rball - rball*Math.sin(ang), wy1 - Math.sin(ang)*rball - rball*Math.cos(ang), rball, 1, 'black');
b.elasticity = 0;
b.acceleration = g;
b.a.y = 1;
let wall = new Wall(wx1, wy1, wx2, wy2);

document.onload = canvasWall();
document.onload = mainLoop();
document.onload = cleanAnswer();

function freeze() {
    pause();
    clearInterval(Interval);
}

var velo;
var time;
var seconds = 00;
var tens = 00;
var dez = 00;
var appendTens = document.getElementById("tens");
var appendSeconds = document.getElementById("seconds");
var Interval;

btnStart.onclick = function() {
    if(!running) {
        running = true;
        animate();
    }
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10);
    btnStart.disabled = true;
    valor.disabled = false;
}


function startTimer () {
    tens++;

    if(tens <= 9){
        appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9){
        appendTens.innerHTML = tens;

    }

    if (tens > 99) {
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9){
        appendSeconds.innerHTML = seconds;
    }

}




function rad_deg(rad){
    new_rad = Math.abs(rad - 2*Math.PI);
    let deg = (new_rad * 180.0) / Math.PI;
    return deg;
}


function pause() {
    cancelAnimationFrame(animId);
}

btnReset.onclick = function() {
    document.location.reload();
}

function animate() {
    animId = requestAnimationFrame(animate);
    mainLoop();
}

function round(n, precision){
    let factor = 10**precision;
    return Math.round(n*factor)/factor;
}

function rand(min, max){
    return Math.random() * (max-min) + min;
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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: Math.round(evt.clientY - rect.bottom) * (-1)
    };
  }

// canvas.addEventListener("mousemove", function (evt) {
//     var mousePos = getMousePos(canvas, evt);
//     xpos.innerHTML = mousePos.x;
//     ypos.innerHTML = mousePos.y;
// }, false);

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

function drawCircle(x,y,r,color){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPanel(){
    ctx.beginPath();
    ctx.moveTo(wx2,wy2);
    ctx.lineTo(wx1,wy1);
    ctx.closePath();
}

function mainLoop() {
    ctx.save();
    if(tens <= 9){
        dez = "0" + tens;
    }

    if (tens > 9){
        dez = tens;
    }
    time = parseFloat(String(seconds)+"."+String(dez));
    velo = round(9.8*Math.sin(round(new_rad,3))*time,1)
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    BALLS.forEach((b, index) => {
        b.drawBall('black',false)
        // b.v.y += g;
        b.reposition();
        WALLS.forEach((w) => {
            w.drawWall();
            if(collisionDetectionWall(BALLS[index], w)){
                penetrationResultWall(BALLS[index], w);
                collisionResultWall(BALLS[index], w);
            }
        })
        
    });

    if(collisionDetectionWall(b, wallBottom)){
        freeze();
        formSlope.innerHTML = "$\\large{0+9.8\\,sen("+round(rad_deg(ang),1)+"°)\\,"+time+" \\approx "+velo+"}$";
        ansSlope.innerHTML = "$\\large{"+velo+"}\\,m/s^{2}$";
        MathJax.typeset();
    }
    
    ctx.beginPath();
    ctx.arc(wx2,wy2,wy2/2,Math.PI,new_rad - Math.PI,false);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.closePath();
    drawPanel();
    //document.getElementById("vel").innerHTML = (velo+" m/s");
    ctx.restore();
}

function canvasWall(){
    wallBottom = new Wall(0, wy2, canvasWidth, wy2);
    wallLeft = new Wall(0, 0, 0, canvasHeight);
    wallRight = new Wall(canvasWidth, 0, canvasWidth, canvasHeight);
}

document.getElementById("angle").innerHTML = (round(rad_deg(ang),1)+"°");




function cleanAnswer(){
    valor.value = "";
}


function isAnswered() {
    if (valor.value.length == 0){
        return false;
    }
    else{
        return true;
    }
}

function mustAnswer() {
    window.alert("Você deve inserir um valor válido para ver a resposta.");
    cleanAnswer();
}

    btnConfirm.onclick = function() {
    if (isAnswered()) {
        clicked = true;
        btnConfirm.disabled = true;
        valor.disabled = true;
        document.getElementById("myCanvas").focus();
        if(valor.value == velo){
            valor.className = "correct";
        }
        else{
            valor.className = "wrong";
        }
    }
    else{
        mustAnswer();
    }
}

answer.addEventListener("click", function() {
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
