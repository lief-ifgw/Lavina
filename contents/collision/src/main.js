/********* Dimensions ************/
const canvasWidth   = 600;
const canvasHeight  = 400;
const pivo          = new Vector2D(canvasWidth / 6.0, 0)
const defaulth = 10;
const defaultAngle  = 90;
const defaultLenght = 10; 
const defaultM1 = 10;
const defaultM2 = 10;
/********** Variables ********/

var oldX,oldY;
var pendulo;
var ball;
var theta;         // Initial angle
var xpos, ypos, radians;  // Pendulum position parameters
var tcol = 0.0;
var t = 0.0;
var h = 0.0;            //pendulum height
/********** Physical constants ********/

const alturaH    = 15;       // Fixed height H to the ground.
const defaultG   = 10.0;    // Gravity acceleration

var ang_freq = Math.sqrt(defaultG / defaultLenght);

/********** Canvas building ********/

var canvas      = document.getElementById("myCanvas");
var ctx         = canvas.getContext("2d");
canvas.width    = canvasWidth;
canvas.height   = canvasHeight;
ctx.font = '18px Arial';



/********** HTML interaction ********/

var sliderAngle  = document.getElementById("angle");
var angleView    = document.getElementById("outAngle");
var sliderM1     = document.getElementById("m1");
var m1View       = document.getElementById("outMass1");
var sliderM2     = document.getElementById("m2");
var m2View       = document.getElementById("outMass2");
var btnRun       = document.getElementById("button-start");
var btnStop      = document.getElementById("button-stop");


angleView.innerHTML  = sliderAngle.value;
m1View.innerHTML = sliderM1.value;
m2View.innerHTML = sliderM2.value;

ang_freq = Math.sqrt(defaultG/defaultLenght);

osc_period = 2.0 * Math.PI * (1.0/ang_freq);




//sliderLenght.oninput = function() {
//      lenghtView.innerHTML = this.value;
//
//    ang_freq = Math.sqrt(defaultG/sliderLenght.value);
//    omegaView.innerHTML = ang_freq;
//
//    osc_period = 2.0 * Math.PI * (1.0/ang_freq);
//    TView.innerHTML = osc_period;
//
//    pendulo.setLenght(1.0 * this.value);
//    pendulo.setAngularFrequency(ang_freq);

//    draw();
//}


sliderAngle.oninput = function() {
    angleView.innerHTML = this.value;
    pendulo.setAngle(this.value);

    draw();
}

sliderM1.oninput = function(){
  m1View.innerHTML = this.value;
}

sliderM2.oninput = function(){
  m2View.innerHTML = this.value;
}

radians = sliderAngle.value  * (Math.PI / 180.0);

var pos = new Vector2D(pivo.x - defaultLenght * 10.0 * Math.sin(radians), defaultLenght * 10.0 * Math.cos(radians));
var posb = new Vector2D(100 ,100)

h = defaultLenght - defaultLenght*Math.cos(radians);


/********** Animation ********/
function init() {

  pendulo = new Pendulo(pivo, pos, ang_freq, defaultLenght, sliderAngle.value, sliderM1.value);
  pendulo.setLenght(defaultLenght);
  pendulo.setAngle(sliderAngle.value);
  ball = new Ball(pivo, posb, sliderM1.value,sliderM2.value, h,oldX,oldY);
  draw();
 }

document.onload = init();

//btnRun.onclick = function() {
//    console.log("Start!");
//    animate();
   //if(!running) {
   //   if (answered === true) {
   //         init();
   //         dynamics(1.0 * sliderForce.value);
   //         running = true;
   //         animate();
   //     } else {
   //         mustAnswer();
    //    }
    //}
    
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
    if(sliderAngle.value != 0){
     console.log("Start!");
     pendulo.setAngle(sliderAngle.value);
     ball.setMass1(sliderM1.value);
     ball.setMass2(sliderM2.value);
     h = defaultLenght - defaultLenght*Math.cos(sliderAngle.value  * (Math.PI / 180.0));
     console.log("%f %f",sliderAngle.value,h);
     ball.seth(h);
     animate();
    }
    else{
      console.log("Coloque um ângulo diferente de zero!");
    }
  }

    btnStop.onclick = function() {
        pause();
        draw();
       clearInterval(Interval);
  }


  buttonReset.onclick = function() {
    clearInterval(Interval);
    //tens = "00";
    // 	seconds = "00";
    //  appendTens.innerHTML = tens;
    //	appendSeconds.innerHTML = seconds;

    //pendulo.setLenght(1.0 * sliderLenght.value);
    ctx.save();
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    pendulo.setAngle(1.0 * sliderAngle.value);
    ctx.restore();
    draw();
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
    ctx.save();
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    pendulo.draw(ctx);
    ball.draw(ctx);
    ctx.restore();
}

function pause() {
    cancelAnimationFrame(animId);
}

function animate() {
    animId = requestAnimationFrame(animate);
    t += 0.03
    pendulo.move(t);
  
      if(pendulo.pos.x > ball.pos.x - 30 || tcol != 0){
        tcol = t;
        pendulo.stop();
        ball.move(t);
      }
    
    if(ball.pos.y >  400 - 14 ){
      pause();
    }

    console.log("%d, %d",t,tcol);

    draw();
}

draw();
  
