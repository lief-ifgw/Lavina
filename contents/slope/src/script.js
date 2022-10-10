const canvasWidth = 600;
const canvasHeight = canvasWidth * 2 / 3;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');

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

let x = 100;
let y = 100;
const g = 0.98;
let friction = 0.1;
let xcm = 0;
let ycm = 0;
let rball = 20;
let ang = Math.PI/6;
let wx2 = canvasWidth - 2*rball;
let wy2 = canvasHeight - 2*rball;
let wx1 = Math.abs(canvasWidth*(Math.sin(ang)))- 2*rball; 
let wy1 = Math.abs(canvasHeight*(Math.cos(ang)))- 2*rball;
let angle = Math.asin((wy2-wy1)/Math.sqrt((wy2-wy1)*(wy2-wy1)+(wx2-wx1)*(wx2-wx1)));
const BALLS = [];
const WALLS = [];

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
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    BALLS.forEach((b, index) => {
        b.drawBall();
        b.v.y += g;
        
        WALLS.forEach((w) => {
            w.drawWall();
            if(collisionDetectionWall(BALLS[index], w)){
                penetrationResultWall(BALLS[index], w);
                collisionResultWall(BALLS[index], w);
            }
        })
        
        b.reposition();
        
    });



    requestAnimationFrame(mainLoop);
}

function canvasWall(){
    let wallTop = new Wall(0, 0, canvasWidth, 0);
    let wallBottom = new Wall(0, canvasHeight, canvasWidth, canvasHeight);
    let wallLeft = new Wall(0, 0, 0, canvasHeight);
    let wallRight = new Wall(canvasWidth, 0, canvasWidth, canvasHeight);
    let wallTop2 = new Wall(0, -1, canvasWidth, -1);
    let wallBottom2 = new Wall(0, canvasHeight + 1, canvasWidth, canvasHeight + 1);
    let wallLeft2 = new Wall(-1, 0, -1, canvasHeight);
    let wallRight2 = new Wall(canvasWidth + 1, 0, canvasWidth + 1, canvasHeight);
}

let wall = new Wall(wx1, wy1, wx2, wy2);

let ball1 = new Ball("ball1", wx1+rball, wy1-rball, rball, 1, 'black');
ball1.elasticity = 0.2;

canvasWall();


document.getElementById("angle").innerHTML = round(angle,4);
document.getElementById("wx1").innerHTML = round(wx1,4);
document.getElementById("wy1").innerHTML = round(wy1,4);


requestAnimationFrame(mainLoop);