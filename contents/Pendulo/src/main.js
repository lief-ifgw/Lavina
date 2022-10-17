/********* Dimensions ************/
const canvasWidth   = 600;
const canvasHeight  = 400;
const pivo          = new Vector2D(canvasWidth / 2.0, 0)
const defaultLenght = 25;
const defaultAngle  = 40;
/********** Variables ********/

var theta, compL;         // Initial angle and rope lenght
var ang_freq;             // Oscillation period and angular frequency (to be answered)
var xpos, ypos, radians;  // Pendulum position parameters

var t = 0.0;
/********** Physical constants ********/

const alturaH    = 15;       // Fixed height H to the ground.
const defaultG   = 10.0;    // Gravity acceleration
const osc_period = 1;     // Default oscillation period

/********** Canvas building ********/

var canvas      = document.getElementById("myCanvas");
var ctx         = canvas.getContext("2d");
canvas.width    = canvasWidth;
canvas.height   = canvasHeight;
ctx.font = '18px Arial';

radians = defaultAngle  * (Math.PI / 180.0);

var pos = new Vector2D(pivo.x - defaultLenght * 10.0 * Math.sin(radians), defaultLenght * 10.0 * Math.cos(radians));

var pendulo = new Pendulo(pivo, pos, ang_freq, defaultLenght, defaultAngle);


/********** HTML interaction ********/

var sliderLenght = document.getElementById("lenght");
var sliderAngle  = document.getElementById("angle");
var lenghtView   = document.getElementById("outLenght");
var angleView    = document.getElementById("outAngle");
var omegaView    = document.getElementById("omega");
var btnRun       = document.getElementById("button-start");

lenghtView.innerHTML = sliderLenght.value;
angleView.innerHTML  = sliderAngle.value;

ang_freq = Math.sqrt(defaultG/sliderLenght.value);
omegaView.innerHTML  = ang_freq;


sliderLenght.oninput = function() {
    lenghtView.innerHTML = this.value;
    ang_freq = Math.sqrt(defaultG/sliderLenght.value);
    omegaView.innerHTML = ang_freq;
    pendulo.setLenght(1.0 * this.value);
    draw();
}


sliderAngle.oninput = function() {
    angleView.innerHTML = this.value;
    pendulo.setAngle(1.0 * this.value);

    draw();
}

/********** Animation ********/
// function init() {
    // animate();
// }

// document.onload = init();

btnRun.onclick = function() {
    console.log("Start!");
    animate();
//   if(!running) {
//      if (answered === true) {
//            init();
//            dynamics(1.0 * sliderForce.value);
//            running = true;
//            animate();
//        } else {
//            mustAnswer();
//        }
//    }
}

function draw() {
    pendulo.draw(ctx);
}

function pause() {
    cancelAnimationFrame(animId);
}

function animate() {
    animId = requestAnimationFrame(animate);
    t+= 0.02;
    pendulo.move(t);
    draw();
}

draw();
