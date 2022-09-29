const canvasWidth = 600;
const canvasHeight = canvasWidth * 2 / 3;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');

let x = 100;
let y = 100;
let friction = 0.1;
let xcm = 0;
let ycm = 0;
const BALLZ = [];
const WALLZ = [];
const MASS = [];


let UP, DOWN, LEFT, RIGHT;

// canvas.addEventListener('mousedown', function(event){
//     ball1.pos.x = event.x;
//     ball1.pos.y = event.y;

//     console.log('x: '+event.x+' ; y: '+event.y);
// });

function keyControl(b) {
    canvas.addEventListener('keydown', function(e){
        if(e.code === 'ArrowUp'){
            //console.log('Seta para cima');
            UP = true;
        }
        if(e.code === 'ArrowDown'){
            //console.log('Seta para baixo');
            DOWN = true;
        }
        if(e.code === 'ArrowLeft'){
            //console.log('Seta para esquerda');
            LEFT = true;
        }
        if(e.code === 'ArrowRight'){
            //console.log('Seta para direita');
            RIGHT = true;
        }
    })
    
    
    canvas.addEventListener('keyup', function(e){
        if(e.code === 'ArrowUp'){
            UP = false;
        }
        if(e.code === 'ArrowDown'){
            DOWN = false;
        }
        if(e.code === 'ArrowLeft'){
            LEFT = false;
        }
        if(e.code === 'ArrowRight'){
            RIGHT = false;
        }
    })


    if(UP){
        b.a.y = -b.acceleration;
    }
    if(DOWN){
        b.a.y = b.acceleration;
    }
    if(LEFT){
        b.a.x = -b.acceleration;
    }
    if(RIGHT){
        b.a.x = b.acceleration;
    }
    if(!UP && !DOWN){
        b.a.y = 0;
    }
    if(!LEFT && !RIGHT){
        b.a.x = 0;
    }
}

function round(n, precision){
    let factor = 10**precision;
    return Math.round(n*factor)/factor;
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

function collisionDetectionBall(obj1,obj2){
    if(obj1.r + obj2.r >= Vector2D.subtract(obj1.pos,obj2.pos).length()){
        return true;
    }
    else{
        return false;
    }
}

function collisionDetectionWall(obj1,w1){
    let ballClosest = Vector2D.subtract(closestPointBW(obj1,w1),obj1.pos);
    if(ballClosest.length() <= obj1.r){
        return true;
    }
}

function penetrationResultBall(obj1,obj2){
    let dist = Vector2D.subtract(obj1.pos,obj2.pos);
    let profund = obj1.r + obj2.r -dist.length();
    let penetr = Vector2D.scale(Vector2D.norma(dist),profund/(obj1.inv_m + obj2.inv_m));
    obj1.pos = Vector2D.add(obj1.pos,Vector2D.scale(penetr,obj1.inv_m));
    obj2.pos = Vector2D.add(obj2.pos,Vector2D.scale(penetr,-obj2.inv_m));
}

function penetrationResultWall(obj1, w1){
    let penVect = Vector2D.subtract(obj1.pos,closestPointBW(obj1, w1));
    obj1.pos = Vector2D.add(obj1.pos, Vector2D.scale(Vector2D.norma(penVect),obj1.r-penVect.length()));
}

function collisionResultBall(obj1, obj2){
    let normal = Vector2D.norma(Vector2D.subtract(obj1.pos,obj2.pos));
    let vRel = Vector2D.subtract(obj1.v,obj2.v);
    let sepVel = Vector2D.dotProduct(vRel, normal);
    //let sepVelVec = normal.scale(sepVel * elasticity);
    let new_sepVel = -sepVel *Math.min(obj1.elasticity, obj2.elasticity);
    let sepVel_dif = new_sepVel - sepVel;
    let impulse = sepVel_dif/(obj1.inv_m+obj2.inv_m);
    let impulseVec = Vector2D.scale(normal,impulse);
    obj1.v = Vector2D.add(obj1.v,Vector2D.scale(impulseVec,obj1.inv_m));
    obj2.v = Vector2D.add(obj2.v,Vector2D.scale(impulseVec,-obj2.inv_m));
}

function collisionResultWall(obj1, w1){
    let normal = Vector2D.norma(Vector2D.subtract(obj1.pos,closestPointBW(obj1, w1)));
    let sepVel = Vector2D.dotProduct(obj1.v, normal);
    let new_sepVel = -sepVel * obj1.elasticity;
    let vsep_diff = sepVel - new_sepVel;
    obj1.v = Vector2D.add(obj1.v,Vector2D.scale(normal,-vsep_diff));
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

function drawCircle(x,y){
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
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
    for(i = 0; i < BALLZ.length; i++){
        if(MASS.length <= 2){MASS.push(BALLZ[i].m);}
        xcm += BALLZ[i].m * BALLZ[i].pos.x;
        ycm += BALLZ[i].m * BALLZ[i].pos.y;
    }
    let totalMass = MASS.reduce((p,c) => p + c, 0)
    xcm2 = xcm/totalMass;
    ycm2 = ycm/totalMass;
    xcm = 0;
    ycm = 0;
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

function mainLoop() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawGrid(50,50,'blue');
    BALLZ.forEach((b, index) => {
        b.drawBall();

        if(b.player){
            keyControl(b);
        }
        for(let i = index+1; i<BALLZ.length; i++){
            if(collisionDetectionBall(BALLZ[index], BALLZ[i])){
                ctx.fillText("Colisão!", 755, 300);
                penetrationResultBall(BALLZ[index], BALLZ[i]);
                collisionResultBall(BALLZ[index], BALLZ[i]);
            }
        }
        
        WALLZ.forEach((w) => {
            if(collisionDetectionWall(BALLZ[index], w)){
                penetrationResultWall(BALLZ[index], w);
                collisionResultWall(BALLZ[index], w);
            }
        })
    
        
        
        b.reposition();
        
        
    });

    WALLZ.forEach((w) => {
        w.drawWall();
    });

    massCenter();

    document.getElementById("b1x").innerHTML = round(ball1.pos.x - pex * s, 0);
    document.getElementById("b1y").innerHTML = round(-1 * ball1.pos.y + pey * (Math.round(ySpaces)-s), 0);
    document.getElementById("mb1").innerHTML = ball1.m;
    document.getElementById("b2x").innerHTML = round(ball2.pos.x - pex * s, 0);
    document.getElementById("b2y").innerHTML = round(-1 * ball2.pos.y + pey * (Math.round(ySpaces)-s), 0);
    document.getElementById("mb2").innerHTML = ball2.m;
    document.getElementById("b3x").innerHTML = round(ball3.pos.x - pex * s, 0);
    document.getElementById("b3y").innerHTML = round(-1 * ball3.pos.y + pey * (Math.round(ySpaces)-s), 0);
    document.getElementById("mb3").innerHTML = ball3.m;
    document.getElementById("cmX").innerHTML = round(xcm2 - pex * s, 0);
    document.getElementById("cmY").innerHTML = round(-1 * ycm2 + pey * (Math.round(ySpaces)-s), 0);

    if(document.getElementById("displayCM").checked){
        drawX(xcm2,ycm2,20,7);
        document.getElementById("myCanvas").focus();
    }

    requestAnimationFrame(mainLoop);
}

function playerChange(p){
    BALLZ.forEach((b) => {
        if(b.name === p.name){
            b.player = 1;
            document.getElementById(b.name).style.border = "2px solid black";
        }
        else{
            b.player = 0;
            document.getElementById(b.name).style.border = "1px solid black";
        }
    });
    document.getElementById("myCanvas").focus();
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

let ball1 = new Ball("ball1", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, Math.ceil(Math.random()*9), 'blue');
let ball2 = new Ball("ball2", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, Math.ceil(Math.random()*9), 'red');
let ball3 = new Ball("ball3", Math.random()*canvasWidth, Math.random()*canvasHeight, 60, Math.ceil(Math.random()*9), 'yellow');

canvasWall();


requestAnimationFrame(mainLoop);