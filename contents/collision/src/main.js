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
var theta;                     // Initial angle
var xpos, ypos, radians;       // Pendulum position parameters
var tcol = 0.0;
var t = 0.0;
var h = 0.0;                   //pendulum height
var arrpos = new Array();      // array for the ball trajectory
var posfin;

/********** Physical constants ********/

const alturaH    = 20;       // Fixed height H to the ground.
const defaultG   = 10.0;     // Gravity acceleration

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
var btnReset     = document.getElementById("button-reset");

var answer       = document.getElementById("answ");

angleView.innerHTML  = sliderAngle.value;
m1View.innerHTML = sliderM1.value;
m2View.innerHTML = sliderM2.value;

ang_freq = Math.sqrt(defaultG/defaultLenght);

osc_period = 2.0 * Math.PI * (1.0/ang_freq);

sliderAngle.oninput = function() {
    angleView.innerHTML = this.value;
    pendulo.setAngle(this.value);
    radians = sliderAngle.value  * (Math.PI / 180.0);
    h = defaultLenght - defaultLenght*Math.cos(radians);
    posfin = (4.0 * Math.sqrt(alturaH*h))/(1 + parseFloat(sliderM2.value/sliderM1.value));

    draw();
}

sliderM1.oninput = function(){
  m1View.innerHTML = this.value;
  posfin = (4.0 * Math.sqrt(alturaH*h))/(1 + parseFloat(sliderM2.value/sliderM1.value));

}

sliderM2.oninput = function(){
  m2View.innerHTML = this.value;
  posfin = (4.0 * Math.sqrt(alturaH*h))/(1 + parseFloat(sliderM2.value/sliderM1.value));

}


var pos = new Vector2D(pivo.x - defaultLenght * 10.0 * Math.sin(radians), defaultLenght * 10.0 * Math.cos(radians));
var posb = new Vector2D(100 ,100)


/********** Animation ********/
function init() {
  pendulo = new Pendulo(pivo, pos, ang_freq, defaultLenght, sliderAngle.value, sliderM1.value);
  pendulo.setLenght(defaultLenght);
  pendulo.setAngle(sliderAngle.value);
  ball = new Ball(pivo, posb, sliderM1.value,sliderM2.value, h,arrpos);
  draw();
 }

document.onload = init();



// STOPWATCH STUFF

window.onload = function () {
  h = defaultLenght - parseFloat(defaultLenght*Math.cos(defaultAngle  * (Math.PI / 180.0)));
  posfin = (4.0 * Math.sqrt(alturaH*h))/(1 + parseFloat(defaultM2/defaultM1));

  var seconds = 0o0;
  var tens = 0o0;
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")

  
  var Interval ;

  btnRun.onclick = function() {
    posfin = (4.0 * Math.sqrt(alturaH*h))/(1 + parseFloat(sliderM2.value/sliderM1.value));
    if(sliderAngle.value != 0){
     console.log("Start!");
     console.log(answer.value);
      if(answer.value != 0){
        //console.log(answer.value);
        pendulo.setAngle(sliderAngle.value);
        ball.setMass1(sliderM1.value);
        ball.setMass2(sliderM2.value);
        h = defaultLenght - defaultLenght*Math.cos(sliderAngle.value  * (Math.PI / 180.0));
        ball.seth(h);
        animate();
      }
      else{
        alert("Reponda a posição final!");
      }

    }
    else{
      alert("Coloque um ângulo diferente de zero!");
    }
  }


  btnReset.onclick = function() {
    clearInterval(Interval);

    cancelAnimationFrame(animate);
    init();
    pause();
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
      t = 0.0;
      if(answer.value < ( parseFloat(posfin) + parseFloat(posfin*0.05)) && answer.value > (posfin-(posfin*0.05)) ){
        alert('Resposta correta!  Re: ' + posfin + ' m');
        console.log("%f %f",ball.pos.x,ball.pos.y);
      }
      else{
        alert('Resposta incorreta!  Re: ' + posfin + ' m');
        console.log("%f %f",ball.pos.x,ball.pos.y);
      }
    }


    draw();
}

draw();
  
