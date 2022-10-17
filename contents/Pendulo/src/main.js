/********* Dimensions ************/
const canvasWidth   = 600;
const canvasHeight  = 400;
const pivoX         = canvasWidth / 2.0;  // X position for the pivot
const pivoY         = 0;    // '' for the Y

/********** Variables ********/

var theta, compL;         // Initial angle and rope lenght
var ang_freq;             // Oscillation period and angular frequency (to be answered)
var xpos, ypos, radians;  // Pendulum position parameters

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
    draw();


}


sliderAngle.oninput = function() {
    angleView.innerHTML = this.value;
    draw();
}

/********** Animation ********/



function init() {
}

document.onload = init();

//btnRun.onclick = function() {
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
//}


function pause() {
    cancelAnimationFrame(animId);
}

function draw() {
    ctx.save();
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    ctx.beginPath();
    ctx.moveTo(pivoX,pivoY);
    const radians = sliderAngle.value * (Math.PI / 180.0);
    xpos = pivoX - sliderLenght.value * 10.0 * Math.sin(radians);
    ypos = sliderLenght.value * 10.0 * Math.cos(radians);
    ctx.lineTo(xpos,ypos);
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(xpos, ypos, 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    /* Black border on the circle */
    ctx.lineWidth = 2.5; /* Border width */
    ctx.strokeStyle = 'black'; /* Border color */
    ctx.fill();
    /* Draw the border */ 
    ctx.stroke();  /* It's necessary only if your are drawing the border */   
    ctx.restore();
}

function animate() {
    animId = requestAnimationFrame(animate);
    move();
    draw();
}



draw();
