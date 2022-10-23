/********* Dimensions ************/
const canvasWidth   = 600;
const canvasHeight  = 400;
const pivo          = new Vector2D(canvasWidth / 2.0, 0)
const defaultLenght = 25;
const defaultAngle  = 40;
/********** Variables ********/

var theta, compL;         // Initial angle and rope lenght
var xpos, ypos, radians;  // Pendulum position parameters

var t = 0.0;
/********** Physical constants ********/

const alturaH    = 15;       // Fixed height H to the ground.
const defaultG   = 10.0;    // Gravity acceleration
const osc_period = 1;     // Default oscillation period
var ang_freq = Math.sqrt(defaultG / defaultLenght);

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
var btnStop      = document.getElementById("button-stop");
var t_sec        = document.getElementById("seconds");


lenghtView.innerHTML = sliderLenght.value;
angleView.innerHTML  = sliderAngle.value;

ang_freq = Math.sqrt(defaultG/sliderLenght.value);
omegaView.innerHTML  = ang_freq;


sliderLenght.oninput = function() {
    lenghtView.innerHTML = this.value;
    ang_freq = Math.sqrt(defaultG/sliderLenght.value);
    omegaView.innerHTML = ang_freq;
    pendulo.setLenght(1.0 * this.value);
    pendulo.setAngularFrequency(ang_freq);
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

//btnRun.onclick = function() {
//    console.log("Start!");
//    animate();
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

//btnStop.onclick = function() {

//    pause();
//    ctx.clearRect(0,0, canvasWidth, canvasHeight);
//    draw();
//}

// STOPWATCH STUFF

window.onload = function () {

  var seconds = 00;
  var tens = 00;
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")
  //var buttonStart = document.getElementById('button-start');
  //var buttonStop = document.getElementById('button-stop');
  var buttonReset = document.getElementById('button-reset');
  var Interval ;

  btnRun.onclick = function() {
     console.log("Start!");
     //animate();
    clearInterval(Interval);
     Interval = setInterval(startTimer, 10);
     animate();
  }

    btnStop.onclick = function() {
        pause();
        draw();
       clearInterval(Interval);
  }


  buttonReset.onclick = function() {
     clearInterval(Interval);
    tens = "00";
  	seconds = "00";
    appendTens.innerHTML = tens;
  	appendSeconds.innerHTML = seconds;
  }



  function startTimer () {
    tens++;

    if(tens <= 9){
      appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9){
      appendTens.innerHTML = tens;

    }

    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }

  }


}


function draw() {
    pendulo.draw(ctx);
}

function pause() {
    cancelAnimationFrame(animId);
}

function animate() {
    animId = requestAnimationFrame(animate);
    t += 0.1;
    //t += t_sec.value;
    pendulo.move(t);
    draw();
}

draw();
