const canvasWidth = 900;
const canvasHeight = 500;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext('2d');

let originUp = document.getElementById('up').checked === true;
let originDown = document.getElementById('down').checked === true;
document.getElementById('down').checked = true;
let origin = 1;
let shift = 0;

function check(a){
    document.getElementById(a).checked = true;
}

let x = 100;
let y = 100;
let friction = 0.1;
let elasticity = 1;

const BALLZ = [];

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

function collision(b1,b2){
    if(b1.r + b2.r >= b1.pos.subtract(b2.pos).length()){
        return true;
    }
    else{
        return false;
    }
}

function penetration(b1,b2){
    let dist = b1.pos.subtract(b2.pos);
    let profund = b1.r + b2.r -dist.length();
    let penetr = dist.normalize().mult(profund/(b1.inv_m + b2.inv_m));
    b1.pos = b1.pos.add(penetr.mult(b1.inv_m));
    b2.pos = b2.pos.add(penetr.mult(-b2.inv_m));
}

function collisionResult(obj1, obj2){
    let normal = obj1.pos.subtract(obj2.pos).normalize();
    let vRel = obj1.v.subtract(obj2.v);
    let sepVel = Vector.dotProduct(vRel, normal);
    //let sepVelVec = normal.mult(sepVel * elasticity);
    let new_sepVel = -sepVel *Math.min(obj1.elasticity, obj2.elasticity);
    let sepVel_dif = new_sepVel - sepVel;
    let impulse = sepVel_dif/(obj1.inv_m+obj2.inv_m);
    let impulseVec = normal.mult(impulse);
    obj1.v = obj1.v.add(impulseVec.mult(obj1.inv_m));
    obj2.v = obj2.v.add(impulseVec.mult(-obj2.inv_m));
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
    let line = new Vector(obj1.pos.x, obj2.pos.y);
    setLine(obj1.pos.x,obj1.pos.y,obj2.pos.x,obj2.pos.y,'black');
    ctx.beginPath();
    ctx.arc((obj1.pos.x - obj2.pos.x + 2 * obj2.pos.x)/2,(obj1.pos.y - obj2.pos.y + 2 * obj2.pos.y)/2,5,0,2*Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
} 

function mainLoop() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    BALLZ.forEach((b, index) => {
        b.drawBall();

        if(b.player){
            keyControl(b);
        }
        for(let i = index+1; i<BALLZ.length; i++){
            if(collision(BALLZ[index], BALLZ[i])){
                ctx.fillText("Colisão!", 755, 300);
                penetration(BALLZ[index], BALLZ[i]);
                collisionResult(BALLZ[index], BALLZ[i]);
            }
        }
        
        let vBall1 = new Vector(ball1.pos.x, ball1.pos.y);
        let vBall2 = new Vector(ball2.pos.x, ball2.pos.y);
        let angle = vBall1.angle(vBall1,vBall2);
        //console.log(angle);

        b.display();
        b.reposition();
        massCenter(ball1, ball2);
        
    });

    let distanceVec = new Vector(0,0);
    distanceVec = ball2.pos.subtract(ball1.pos);
    let momentum = ball1.v.add(ball2.v).length();

    let originUp = document.getElementById('up').checked === true;
    let originDown = document.getElementById('down').checked === true;
    let origin = 1;
    let shift = 0;

    

    let dista = distanceVec.length();
    
    document.getElementById("b1x").innerHTML = round(ball1.pos.x, 0);
    document.getElementById("b1y").innerHTML = round(origin * ball1.pos.y + shift, 0);
    document.getElementById("b2x").innerHTML = round(ball2.pos.x, 0);
    document.getElementById("b2y").innerHTML = round(origin * ball2.pos.y + shift, 0);
    document.getElementById("dist").innerHTML = round(dista, 1);
    document.getElementById("cmX").innerHTML = round(distanceVec.mult(1/2).x, 0);
    document.getElementById("cmY").innerHTML = round(origin * distanceVec.mult(1/2).y + shift, 0);
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
    if(originUp){
        origin = 1;
        shift = 0;
    }
    if(originDown){
        origin = -1;
        shift = canvasHeight;
    }
}


let ball1 = new Ball("ball1", 200, 400, 10, 1, 'blue');
let ball2 = new Ball("ball2", 100, 100, 10, 1, 'red');
let ball3 = new Ball("ball3", 500, 200, 60, 5, 'yellow');



requestAnimationFrame(mainLoop);