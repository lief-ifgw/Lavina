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
const freq = 15;
let c = 0;
const g = 0.098;
let friction = 0;
let xcm = 0;
let ycm = 0;
let rball = 10;
let ang = rand(3/2*Math.PI,2*Math.PI);
let new_rad = Math.abs(ang - 2*Math.PI);
let wx2 = canvasWidth - 6*rball;
let wy2 = canvasHeight - 3*rball;
let wx1 = wx2 - wy2*Math.cos(ang); 
let wy1 = wy2 + wy2*Math.sin(ang);
const BALLS = [];
const WALLS = [];
let wallBottom;
let wallLeft;
let wallRight;

let b = new Ball("ball1", wx1 + Math.cos(ang)*rball - rball*Math.sin(ang), wy1 - Math.sin(ang)*rball - rball*Math.cos(ang), rball, 1, 'black');
b.elasticity = 1;
b.acceleration = g;
b.a.y = 1;
let wall = new Wall(wx1, wy1, wx2, wy2);

document.onload = canvasWall();
document.onload = mainLoop();


function rad_deg(rad){
    new_rad = Math.abs(rad - 2*Math.PI);
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
    ctx.rect(rball, wy2, canvasWidth - 2*rball, canvasHeight);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}


function mainLoop() {
    ctx.save();
    c += 1;
    ctx.clearRect(0,0,canvasWidth,wy2);
    BALLS.forEach((b, index) => {
        c === freq ? b.drawBall('black',false,true) : b.drawBall('black',false,false)  
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
        pause();
    }
    
    ctx.beginPath();
    ctx.arc(wx2,wy2,wy2/2,Math.PI,new_rad - Math.PI,false);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();

    document.getElementById("vel").innerHTML = Math.abs(round(b.v.y,1));

    ctx.restore();
}
drawPanel();

function canvasWall(){
    wallBottom = new Wall(0, wy2, canvasWidth, wy2);
    wallLeft = new Wall(0, 0, 0, canvasHeight);
    wallRight = new Wall(canvasWidth, 0, canvasWidth, canvasHeight);
}

document.getElementById("angle").innerHTML = round(rad_deg(ang),1);
document.getElementById("wx1").innerHTML = round(wx1,4);
document.getElementById("wy1").innerHTML = round(wy1,4);
