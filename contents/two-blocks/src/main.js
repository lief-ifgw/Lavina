const b1Color = "#444488";
const b1Height = 25;
const b1Width = 150;
const b2Color = "#448844";
const b2Height = 25;
const b2Width = 50;
const canvasWidth = 600;
const canvasHeight = 400;
const ck1 = 0.2;
const ck2 = 0.2;
const cs1 = 0.4;
const cs2 = 0.4;
const defaultForce = 15;
const defaultMass1 = 2.5;
const defaultMass2 = 1.5;
const gravity = new Vector2D(0, 10);
const pos1 = new Vector2D(0, canvasHeight - b1Height);
const pos2 = new Vector2D(b1Width - b2Width, canvasHeight - b1Height - b2Height);

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var animId;
var b1;
var b2;
var forceVector = new Arrow({x:0, y:0}, 0, 0);
var posForce = new Vector2D(b1Width, canvasHeight - b1Height/2);
var running = false;

var btnReset = document.getElementById("btnReset");
var btnRun = document.getElementById("btnRun");
var forceView = document.getElementById("outForce");
var massView1 = document.getElementById("outM1");
var massView2 = document.getElementById("outM2");
var sliderForce = document.getElementById("force");
var sliderMass1 = document.getElementById("m1");
var sliderMass2 = document.getElementById("m2");

forceView.innerHTML = sliderForce.value;
massView1.innerHTML = sliderMass1.value;
massView2.innerHTML = sliderMass2.value;

sliderForce.oninput = function() {
    forceView.innerHTML = this.value;
    forceVector = new Arrow(posForce, 2.5 * sliderForce.value,0);
    draw();
}

sliderMass1.oninput = function() {
    massView1.innerHTML = this.value;
}

sliderMass2.oninput = function() {
    massView2.innerHTML = this.value;
}

function init() {
    b1 = new Block(pos1, b1Width, b1Height, b1Color);
    b2 = new Block(pos2, b2Width, b2Height, b2Color);

    b1.setMass(1.0 * sliderMass1.value);
    b2.setMass(1.0 * sliderMass2.value);

    forceVector = new Arrow(posForce, 2.5 * sliderForce.value, 0);
}

document.onload = init();

btnRun.onclick = function() {
    if(!running) {
        if (isAnswered()) {
            init();
            dynamics(1.0 * sliderForce.value);
            running = true;
            animate();
        } else {
            mustAnswer();
        }
    }
}

btnReset.onclick = function() {
    sliderForce.value = defaultForce;
    sliderMass1.value = defaultMass1;
    sliderMass2.value = defaultMass2;
    forceView.innerHTML = sliderForce.value;
    massView1.innerHTML = sliderMass1.value;
    massView2.innerHTML = sliderMass2.value;

    running = false;
    posForce = new Vector2D(pos1.x + b1Width, pos1.y + b1Height/2);
    forceVector = new Arrow(posForce, 2.5 * defaultForce,0);

    init();
    draw();
    pause();
}

function dynamics(f) {
    b2.normal = new Vector2D.inverse(b2.weight);
    b2.forces.incrementBy(new Vector2D.add(b2.weight, b2.normal));
    let normal21 = new Vector2D.inverse(b2.normal);
    b1.normal = new Vector2D.inverse(new Vector2D.add(b1.weight, normal21));
    b1.forces.incrementBy(b1.weight);
    b1.forces.incrementBy(b1.normal);
    b1.forces.incrementBy(normal21);

    let totalMass = b1.mass + b2.mass;
    let sFriction1Max = cs1 * b1.normal.length();
    let sFriction2Max = cs2 * b2.normal.length();
    let kFriction1 = new Vector2D(-1.0 * ck1 * b1.normal.length(), 0.0);
    let kFriction2 = new Vector2D(ck2 * b2.normal.length(), 0.0);
    let force = new Vector2D(f, 0);

    if (force.length() > sFriction1Max) {
        b1.forces.incrementBy(force);
        b1.forces.incrementBy(kFriction1);

        let acc = (force.length() - ck1 * totalMass * gravity.length()) / totalMass;
        let fat2 = acc * b2.mass;

        if (fat2 <= sFriction2Max) {
            b1.forces = new Vector2D(b1.mass * acc, 0.0);
            b2.forces = new Vector2D(b2.mass * acc, 0.0);
        } else {
            b2.forces.incrementBy(kFriction2);
            b1.forces.incrementBy(new Vector2D.scale(kFriction2, -1.0));
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
        forceVector = new Arrow(posForce, 2.5 * sliderForce.value,0);
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

function animate() {
    animId = requestAnimationFrame(animate);
    move();
    draw();
}

draw();
