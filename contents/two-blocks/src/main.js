/********* Dimensions ************/
const b1Height      = 35;
const b1Width       = 175;
const b2Height      = 35;
const b2Width       = 50;
const canvasWidth   = 600;
const canvasHeight  = 400;

/********** Physical constants ********/
const ck1     = 0.2; /* Kinetic friction block 1 */
const ck2     = 0.2; /* Kinetic friction between block 1 and 2 */
const cs1     = 0.4; /* Static friction block 1 */
const cs2     = 0.4; /* Static friction between block 1 and 2 */
const gravity = new Vector2D(0, 10);

/************* Colors ***************/
const b2Color           = "#66aa66";
const b1Color           = "#6666aa";
const fat12DiagColor    = "blue";
const fat2DiagColor     = "blue";
const fat21DiagColor    = "blue";
const force1DiagColor   = "darkgray";
const normal1DiagColor  = "black";
const normal2DiagColor  = "black";
const normal21DiagColor = "green";
const weight1DiagColor  = "red";
const weight2DiagColor  = "red";

/*************** Fixed positions **********************/
const pos1 = new Vector2D(0, canvasHeight - b1Height);
const pos2 = new Vector2D(b1Width - b2Width, canvasHeight - b1Height - b2Height);

/********* Force diagram elements **********/
const pos1Diag      = new Vector2D(75,150);
const pos2Diag      = new Vector2D(450,150);
/* Somando e subtraindo 3px nas posições x para as setas não se sobreporem.*/
const posFat12      = new Vector2D(pos2Diag.x + b2Width, pos2Diag.y + b2Height - 3);
const posFat21      = new Vector2D(pos1Diag.x + b1Width, pos1Diag.y);
const posFat2       = new Vector2D(pos1Diag.x, pos1Diag.y + b1Height - 3);
const posForce1     = new Vector2D(pos1Diag.x + b1Width, pos1Diag.y + b1Height/2);
const posNorm1      = new Vector2D(pos1Diag.x + b1Width/2 + 3, pos1Diag.y + b1Height);
const posNorm2      = new Vector2D(pos2Diag.x + b2Width/2 + 3, pos2Diag.y + b2Height);
/* O valor '-10' é o tamanho da seta, para que fique fora do bloco. */
/* Nesse caso, a posição final que é fixa.*/
var posNorm21       = new Vector2D(pos1Diag.x + b1Width/2 - 3, pos1Diag.y);
const posWeight1    = new Vector2D(pos1Diag.x + b1Width/2, pos1Diag.y + b1Height/2);
const posWeight2    = new Vector2D(pos2Diag.x + b2Width/2, pos2Diag.y + b2Height/2);

/************* Defaul values and other constants ********/
const defaultForce = 15;
const defaultMass1 = 2.5;
const defaultMass2 = 1.5;
const scale        = 2.0;

/***** Canvas and context elements *****/
var canvas      = document.getElementById("myCanvas");
var ctx         = canvas.getContext("2d");
canvas.width    = canvasWidth;
canvas.height   = canvasHeight;

/********* Arrows for the force diagram **********/
var fat12Diag;
var fat2Diag;
var fat21Diag;
var force1Diag;
var forceVector = new Arrow({x:0, y:0}, 0, 0);
var normal1Diag;
var normal2Diag;
var normal21Diag;
var weight1Diag;
var weight2Diag;

/******* Blocks and blocks for force diagram ********/
var b1;
var b2;
var b1Diag;
var b2Diag;

/******** Forces for the dynamics **********/
var fatB12;
var fatB21;
var fatB1;
var force;
var forceValue;
var normal21;
var posForce = new Vector2D(b1Width, canvasHeight - b1Height/2);

/*** Control panel and interaction with HTML elements ***/
var btnReset            = document.getElementById("btnReset");
var btnRun              = document.getElementById("btnRun");
var checkBox            = document.getElementById("show-diagram");
var forceView           = document.getElementById("outForce");
var massView1           = document.getElementById("outM1");
var massView2           = document.getElementById("outM2");
var radioRest           = document.getElementById("rest");
var radioMoveTogether   = document.getElementById("move_together");
var radioMoveSeparately = document.getElementById("move_separately");
var sliderForce         = document.getElementById("force");
var sliderMass1         = document.getElementById("m1");
var sliderMass2         = document.getElementById("m2");

forceView.innerHTML     = sliderForce.value;
massView1.innerHTML     = sliderMass1.value;
massView2.innerHTML     = sliderMass2.value;

/******* Booleans and other stuffs *******/
var animId;
var diagram = false;
var running = false;

/**** Functions for the interaction with the HTML code ****/
sliderForce.oninput = function() {
    forceView.innerHTML = this.value;
    if(!running){
        forceVector = new Arrow(posForce, scale * sliderForce.value, 0);
        draw();
    }
}

sliderMass1.oninput = function() {
    massView1.innerHTML = this.value;
}

sliderMass2.oninput = function() {
    massView2.innerHTML = this.value;
}

function isAnswered() {
    if (radioMoveTogether.checked === true ||
        radioMoveSeparately.checked === true ||
        radioRest.checked === true) {
        return true;
    }
}

function cleanAnswer() {
    radioMoveTogether.checked = false;
    radioMoveSeparately.checked = false;
    radioRest.checked = false;
}

function mustAnswer() {
    alert("Você deve marcar uma opção antes de iniciar a simulação.");
}


btnRun.onclick = function() {
    if (checkBox.checked) {
        diagram = true;
    }
    if(!running) {
        forceValue = 1.0 * sliderForce.value;
        if (isAnswered()) {
            init();
            dynamics(forceValue);
            freeBodyDiagram();
            running = true;
            animate();
        } else {
            mustAnswer();
        }
    }
}

btnReset.onclick = function() {
    sliderForce.value   = defaultForce;
    sliderMass1.value   = defaultMass1;
    sliderMass2.value   = defaultMass2;
    forceView.innerHTML = sliderForce.value;
    massView1.innerHTML = sliderMass1.value;
    massView2.innerHTML = sliderMass2.value;

    diagram     = false;
    running     = false;
    checkBox.checked = false;

    posForce    = new Vector2D(pos1.x + b1Width, pos1.y + b1Height/2);
    forceVector = new Arrow(posForce, scale * defaultForce,0);

    cleanAnswer();
    init();
    draw();
    pause();
}

/**** Initialization of the simulation ****/
function init() {
    b1 = new Block(pos1, b1Width, b1Height, b1Color);
    b2 = new Block(pos2, b2Width, b2Height, b2Color);
    b1.setMass(1.0 * sliderMass1.value);
    b2.setMass(1.0 * sliderMass2.value);
    forceVector = new Arrow(posForce, scale * sliderForce.value, 0);
    draw();
}

document.onload = init();

function dynamics(f) {
    b2.normal = new Vector2D.inverse(b2.weight);
    b2.forces.incrementBy(new Vector2D.add(b2.weight, b2.normal));
    normal21 = new Vector2D.inverse(b2.normal);
    b1.normal = new Vector2D.inverse(new Vector2D.add(b1.weight, normal21));
    b1.forces.incrementBy(b1.weight);
    b1.forces.incrementBy(b1.normal);
    b1.forces.incrementBy(normal21);

    let totalMass = b1.mass + b2.mass;
    let sFriction1Max = cs1 * b1.normal.length();
    let sFriction2Max = cs2 * b2.normal.length();
    let kFriction1 = new Vector2D(-1.0 * ck1 * b1.normal.length(), 0.0);
    let kFriction2 = new Vector2D(ck2 * b2.normal.length(), 0.0);
    force = new Vector2D(f, 0);

    /* Forças apenas para desenhar o diagrama. */
    fatB12 = new Vector2D(0.0, 0.0);
    fatB21 = new Vector2D(0.0, 0.0);
    fatB1  = new Vector2D(-f, 0.0);

    if (force.length() > sFriction1Max) {
        b1.forces.incrementBy(force);
        b1.forces.incrementBy(kFriction1);

        let acc = (force.length() - ck1 * totalMass * gravity.length()) / totalMass;
        let fat2 = acc * b2.mass;

        if (fat2 <= sFriction2Max) {
            b1.forces = new Vector2D(b1.mass * acc, 0.0);
            b2.forces = new Vector2D(b2.mass * acc, 0.0);

            /* Forças apenas para desenhar o diagrama. */
            fatB12 = new Vector2D(fat2, 0.0);
            fatB21 = new Vector2D(-fat2, 0.0);
            fatB1  = new Vector2D(-kFriction1.length(), 0.0);
        } else {
            b2.forces.incrementBy(kFriction2);
            b1.forces.incrementBy(new Vector2D.scale(kFriction2, -1.0));

            /* Forças apenas para desenhar o diagrama. */
            fatB12 = new Vector2D(kFriction2.length(), 0.0);
            fatB21 = new Vector2D(-kFriction2.length(), 0.0);
            fatB1  = new Vector2D(-kFriction1.length(), 0.0);
        }
    }
}

function move() {
    if(b1.pos.x >= b2.pos.x || b1.pos.x >= canvasWidth - 1.5 * b1Width) {
        pause();
    } else {
        b2.move();
        b1.move();
        posForce = new Vector2D(b1.pos.x + b1Width, b1.pos.y + b1Height/2);
        forceVector = new Arrow(posForce, scale * forceValue, 0);
    }
}

function pause() {
    cancelAnimationFrame(animId);
}

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    b1.draw(ctx);
    b2.draw(ctx);
    forceVector.draw(ctx);
    ctx.restore();
}

function drawWithDiagram() {
    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    b1.draw(ctx);
    b1Diag.draw(ctx);
    b2.draw(ctx);
    b2Diag.draw(ctx);
    fat12Diag.draw(ctx);
    fat2Diag.draw(ctx);
    fat21Diag.draw(ctx);
    force1Diag.draw(ctx);
    forceVector.draw(ctx);
    normal1Diag.draw(ctx);
    normal2Diag.draw(ctx);
    normal21Diag.draw(ctx);
    weight1Diag.draw(ctx);
    weight2Diag.draw(ctx);
    ctx.restore();
}

function animate() {
    animId = requestAnimationFrame(animate);
    move();
    if (diagram) {
        drawWithDiagram();
    } else {
        draw();
    }
}

function freeBodyDiagram() {
    posNorm21    = new Vector2D(pos1Diag.x + b1Width/2 - 3, pos1Diag.y - scale * normal21.length() - 10);
    fat12Diag    = new Arrow(posFat12, scale * fatB12.length(), fatB12.angle(), fat12DiagColor);
    fat2Diag     = new Arrow(posFat2, scale * fatB1.length(), fatB1.angle(), fat2DiagColor);
    fat21Diag    = new Arrow(posFat21, scale * fatB21.length(), fatB21.angle(), fat21DiagColor);
    force1Diag   = new Arrow(posForce1, scale * force.length(), force.angle(), force1DiagColor);
    normal1Diag  = new Arrow(posNorm1, scale * b1.normal.length(), b1.normal.angle(), normal1DiagColor);
    normal2Diag  = new Arrow(posNorm2, scale * b2.normal.length(), b2.normal.angle(), normal2DiagColor);
    normal21Diag = new Arrow(posNorm21, scale * normal21.length(), normal21.angle(), normal21DiagColor);
    weight1Diag  = new Arrow(posWeight1, scale * b1.weight.length(), b1.weight.angle(), weight1DiagColor);
    weight2Diag  = new Arrow(posWeight2, scale * b2.weight.length(), b2.weight.angle(), weight2DiagColor);
    b1Diag       = new Block(pos1Diag, b1Width, b1Height, b1Color);
    b2Diag       = new Block(pos2Diag, b2Width, b2Height, b2Color);
}
