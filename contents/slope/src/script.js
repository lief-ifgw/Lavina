const canvasWidth = 600;
const canvasHeight = canvasWidth * 2 / 3;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;


var ctx = canvas.getContext('2d');

let btnStart = document.getElementById("btnStart");
let btnReset = document.getElementById("btnReset");
let running = false;
let animId;
let x = 100;
let y = 100;
const g = 0.98;
let friction = 0.1;
let xcm = 0;
let ycm = 0;
let rball = 20;
let ang = rand(3/2*Math.PI,2*Math.PI);
let wx2 = canvasWidth - 2*rball;
let wy2 = canvasHeight - 2*rball;
let wx1 = wx2 - wy2*Math.cos(ang); 
let wy1 = wy2 + wy2*Math.sin(ang);
const BALLS = [];
const WALLS = [];


let b = new Ball("ball1", wx1+2*rball, wy1+rball, rball, 1, 'black');
b.elasticity = 0.2;
let wall = new Wall(wx1, wy1, wx2, wy2);

document.onload = mainLoop();

function rad_deg(rad){
    let new_rad = Math.abs(rad - 2*Math.PI);
    let deg = (new_rad * 180.0) / Math.PI;
    return deg;
}

btnStart.onclick = function() {
    if(!running) {
        running = true;
        animate();
    }
}

function pause() {
    cancelAnimationFrame(animId);
}

btnReset.onclick = function() {
    running = false;
    mainLoop();
    pause();
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
}

function drawCircle(x,y){
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function mainLoop() {
    ctx.save();
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    BALLS.forEach((b, index) => {
        b.drawBall();
        b.v.y += g;
        b.a.y = g;
        
        WALLS.forEach((w) => {
            w.drawWall();
            if(collisionDetectionWall(BALLS[index], w)){
                penetrationResultWall(BALLS[index], w);
                collisionResultWall(BALLS[index], w);
            }
        })
        
        b.reposition();
        
    });
    
    ctx.beginPath();
    ctx.arc(wx2,wy2,wy2,Math.PI/2,Math.PI,true);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function canvasWall(){
    let wallTop = new Wall(0, 0, canvasWidth, 0);
    let wallBottom = new Wall(0, canvasHeight, canvasWidth, canvasHeight);
    let wallLeft = new Wall(0, 0, 0, canvasHeight);
    let wallRight = new Wall(canvasWidth, 0, canvasWidth, canvasHeight);
}

canvasWall();


document.getElementById("angle").innerHTML = round(rad_deg(ang),1);
document.getElementById("wx1").innerHTML = round(wx1,4);
document.getElementById("wy1").innerHTML = round(wy1,4);
