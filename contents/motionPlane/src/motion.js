const canvasWidth = 600;
const canvasHeight = 400;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');

document.getElementById('down').checked = true;


function check(a){
    document.getElementById(a).checked = true;
}

let x = 100;
let y = 100;
let friction = 0.1;

const BALLZ = [];
const WALLZ = [];

let UP, DOWN, LEFT, RIGHT;

canvas.addEventListener('mousedown', function(event){
    ball1.pos.x = event.x;
    ball1.pos.y = event.y;

    console.log('x: '+event.x+' ; y: '+event.y);
});

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

function collisionDetectionBall(obj1,b2){
    if(obj1.r + b2.r >= Vector2D.subtract(obj1.pos,b2.pos).length()){
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

function penetrationResultBall(obj1,b2){
    let dist = Vector2D.subtract(obj1.pos,b2.pos);
    let profund = obj1.r + b2.r -dist.length();
    let penetr = Vector2D.scale(Vector2D.norma(dist),profund/(obj1.inv_m + b2.inv_m));
    obj1.pos = Vector2D.add(obj1.pos,Vector2D.scale(penetr,obj1.inv_m));
    b2.pos = Vector2D.add(b2.pos,Vector2D.scale(penetr,-b2.inv_m));
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
    obj1.vel = Vector2D.add(obj1.v,Vector2D.scale(normal,-vsep_diff));
}

function setLine(x0,y0,xf,yf,color){
    ctx.beginPath();    
    ctx.moveTo(x0,y0);
    ctx.lineTo(xf,yf);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function massCenter(obj1,obj2){
    let line = new Vector2D(obj1.pos.x, obj2.pos.y);
    setLine(obj1.pos.x,obj1.pos.y,obj2.pos.x,obj2.pos.y,'black');
    ctx.beginPath();
    ctx.arc((obj1.pos.x - obj2.pos.x + 2 * obj2.pos.x)/2,(obj1.pos.y - obj2.pos.y + 2 * obj2.pos.y)/2,5,0,2*Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
} 

function drawGrid(px,py,color){
    let xSpaces = canvasWidth/px;
    let ySpaces = canvasHeight/py;
    for(i = 1; i < xSpaces; i++){
        setLine(px*i,0,px*i,canvasHeight,color);
    }
    for(i = 1; i < ySpaces; i++){
        setLine(0,py*i,canvasWidth,py*i,color);
    }
}

function mainLoop() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawGrid(30,30,'blue');
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
        for(let i = index+1; i<BALLZ.length; i++){
            if(collisionDetectionBall(BALLZ[index], BALLZ[i])){
                penetrationResultBall(BALLZ[index], BALLZ[i]);
                collisionResultBall(BALLZ[index], BALLZ[i]);
            }
        }

        
        let vBall1 = new Vector2D(ball1.pos.x, ball1.pos.y);
        let vBall2 = new Vector2D(ball2.pos.x, ball2.pos.y);
        let angle = Vector2D.angle(vBall1,vBall2);
        //console.log(angle);

        b.reposition();
        massCenter(ball1, ball2);
        
    });

    WALLZ.forEach((w) => {
        w.drawWall();
    });

    let distanceVec = new Vector2D(0,0);
    distanceVec = Vector2D.subtract(ball2.pos,ball1.pos);
    let momentum = Vector2D.add(ball1.v,ball2.v).length();

    originPos();

    let dista = distanceVec.length();
    
    document.getElementById("b1x").innerHTML = round(ball1.pos.x, 0);
    document.getElementById("b1y").innerHTML = round(origin * ball1.pos.y + shift, 0);
    document.getElementById("b2x").innerHTML = round(ball2.pos.x, 0);
    document.getElementById("b2y").innerHTML = round(origin * ball2.pos.y + shift, 0);
    document.getElementById("dist").innerHTML = round(dista, 1);
    document.getElementById("cmX").innerHTML = round(Vector2D.scale(distanceVec,1/2).x, 0);
    document.getElementById("cmY").innerHTML = round(origin * Vector2D.scale(distanceVec,1/2).y + shift, 0);
    document.getElementById("momentum").innerHTML = round(momentum, 1);
         

    requestAnimationFrame(mainLoop);
}

function playerChange(p,p2){
    p.player = 1;
    p2.player = 0;
    document.getElementById(p.name).style.border = "2px solid black";
    document.getElementById(p2.name).style.border = "1px solid black";
    document.getElementById("myCanvas").focus();
}

function originPos(){
    let originUp = document.getElementById('up').checked === true;
    let originDown = document.getElementById('down').checked === true;
    if(originUp){
        origin = 1;
        shift = 0;
    }
    if(originDown){
        origin = -1;
        shift = canvasHeight;
    }
}

function canvasWall(){
    let wallTop = new Wall(0, 0, canvasWidth, 0);
    let wallBottom = new Wall(0, canvasHeight, canvasWidth, canvasHeight);
    let wallLeft = new Wall(0, 0, 0, canvasHeight);
    let wallRight = new Wall(canvasWidth, 0, canvasWidth, canvasHeight);
}

let ball1 = new Ball("ball1", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, 7, 'blue');
let ball2 = new Ball("ball2", Math.random()*canvasWidth, Math.random()*canvasHeight, 10, 3, 'red');
let ball3 = new Ball("ball3", Math.random()*canvasWidth, Math.random()*canvasHeight, 60, 5, 'yellow');
canvasWall();


requestAnimationFrame(mainLoop);