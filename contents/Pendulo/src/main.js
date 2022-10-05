/********* Dimensions ************/
const canvasWidth   = 600;
const canvasHeight  = 400;

/********** Variables ********/

var theta, compL;         // Initial angle and rope lenght
var ang_freq;             // Oscillation period and angular frequency (to be answered)

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


/********** HTML interaction ********/

var sliderLenght = document.getElementById("lenght");
var sliderAngle  = document.getElementById("angle");
var lenghtView   = document.getElementById("outLenght");
var angleView    = document.getElementById("outAngle");
var omegaView    = document.getElementById("omega");

lenghtView.innerHTML = sliderLenght.value;
angleView.innerHTML  = sliderAngle.value;

ang_freq = Math.sqrt(defaultG/sliderLenght.value);
omegaView.innerHTML  = ang_freq;


sliderLenght.oninput = function() {
    lenghtView.innerHTML = this.value;
    ang_freq = Math.sqrt(defaultG/sliderLenght.value);
    omegaView.innerHTML = ang_freq;
}


sliderAngle.oninput = function() {
    angleView.innerHTML = this.value;
}

/********** Animation ********/

ctx.beginPath();
ctx.moveTo(300,0);
ctx.lineTo(300,200);
ctx.arc(300, 200, 20, 0, 2 * Math.PI);
//ctx.fillStyle = "red";
//ctx.fill();
ctx.stroke();

function init() {
}

document.onload = init();

btnRun.onclick = function() {
    if(!running) {
        if (answered === true) {
            init();
            dynamics(1.0 * sliderForce.value);
            running = true;
            animate();
        } else {
            mustAnswer();
        }
    }
}


function pause() {
    cancelAnimationFrame(animId);
}

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
}

function animate() {
    animId = requestAnimationFrame(animate);
    move();
    draw();
}



draw();
