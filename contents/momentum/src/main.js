/********* Dimensions ************/
const canvasWidth   = 600;
const canvasHeight  = 400;
const defaultM1 = 10;
const defaultM2 = 10;
/********** Variables ********/

var oldX,oldY;
var ball1;
var ball2;
var color1 = 'blue';
var color2 = 'red';
var t = 0.0;
var pivo;
var v1f;
var v2f;

/********** Physical constants ********/


/********** Canvas building ********/

var canvas      = document.getElementById("myCanvas");
var ctx         = canvas.getContext("2d");
canvas.width    = canvasWidth;
canvas.height   = canvasHeight;
ctx.font = '18px Arial';


/********** HTML interaction ********/

var sliderM1     = document.getElementById("m1");
var m1View       = document.getElementById("outMass1");
var sliderM2     = document.getElementById("m2");
var m2View       = document.getElementById("outMass2");
var sliderV1     = document.getElementById("v1");
var v1View       = document.getElementById("outSpeed1");
//var sliderV2     = document.getElementById("v2");
//var v2View       = document.getElementById("outSpeed2");
var btnRun       = document.getElementById("button-start");
var btnStop      = document.getElementById("button-stop");
var btnReset     = document.getElementById("button-reset");

//var posfin       = document.getElementById("finalpos");
var answer       = document.getElementById("answ");

m1View.innerHTML = sliderM1.value;
m2View.innerHTML = sliderM2.value;
v1View.innerHTML = sliderV1.value;
//v2View.innerHTML = sliderV2.value;

sliderM1.oninput = function(){
  m1View.innerHTML = this.value;
  
}

sliderM2.oninput = function(){
  m2View.innerHTML = this.value;
}

sliderV1.oninput = function(){
  v1View.innerHTML = this.value;
}

//sliderV2.oninput = function(){
//  v2View.innerHTML = this.value;
//}


var pos1 = new Vector2D(10,200);
var pos2 = new Vector2D(590 ,200)
pivo = new Vector2D(0,200);


/********** Animation ********/
function init() {

  ball1 = new Ball(pivo, pos1, sliderM1.value,color1,sliderV1.value);
  ball2 = new Ball(pivo, pos2, sliderM2.value,color2,-10.0);
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
  var seconds = 0o0;
  var tens = 0o0;
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")
  //var buttonStart = document.getElementById('button-start');
  //var buttonStop = document.getElementById('button-stop');
  //var buttonReset = document.getElementById('button-reset');
  
  var Interval ;

  btnRun.onclick = function() {

        //console.log(answer.value);
          ball1.setMass(sliderM1.value);
          ball1.setV(sliderV1.value);
          ball2.setMass(sliderM2.value);
          ball2.setV(-10.0);
          animate();
  }

  //  btnStop.onclick = function() {
  //      pause();
  //      draw();
  //     clearInterval(Interval);
  //}


  btnReset.onclick = function() {
    clearInterval(Interval);
    //tens = "00";
    // 	seconds = "00";
    //  appendTens.innerHTML = tens;
    //	appendSeconds.innerHTML = seconds;
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
    ball1.draw(ctx);
    ball2.draw(ctx);
    ctx.beginPath();
    ctx.moveTo(0,210);
    ctx.lineTo(600,210);
    ctx.stroke();
    ctx.restore();
}

function pause() {
    cancelAnimationFrame(animId);
}

function animate() {
    animId = requestAnimationFrame(animate);
    t += 0.03
    ball1.move(t);
    ball2.move(t);
    
    if( Math.abs(ball1.pos.x - ball2.pos.x) < 20 ){
      var m1 = parseInt(sliderM1.value);
      var m2 = parseInt(sliderM2.value);
      var v1 = parseInt(sliderV1.value);
      ball1.setV((((m1 - m2)/(m1 + m2))*v1 + (2.0*m2/(m1+m2))*(-10.0)));
      ball2.setV((((2.0*m1)/(m1+m2))*v1 + ((m2 - m1)/(m1+m2))*(-10.0)));

    }
    if (Math.abs(ball2.pos.x) > 590 && t > 1 || Math.abs(ball2.pos.x) < 10 && t > 1 || Math.abs(ball1.pos.x) < 10 && t > 1){
        pause();
        t=0.0;
        var m1 = parseInt(sliderM1.value);  
        var m2 = parseInt(sliderM2.value);
        var v1 = parseInt(sliderV1.value);
        var vfin = (((2.0*m1)/(m1+m2))*v1 + ((m2 - m1)/(m1+m2))*(-10.0));
        if(answer.value >= 0){  
          if( answer.value <= (vfin + (vfin*0.05)) && answer.value >= (vfin - (vfin*0.05))){
            alert('Resposta correta!  Re: ' + vfin + ' m/s');
          }
          else{
            alert('Resposta incorreta!  Re: ' + vfin + ' m/s');
          }
        }
        else{
          if( answer.value >= (vfin + (vfin*0.05)) && answer.value <= (vfin - (vfin*0.05))){
            alert('Resposta correta!  Re: ' + vfin + ' m/s');
          }
          else{
            alert('Resposta incorreta!  Re: ' + vfin + ' m/s');
          }
        }
      }

    draw();
}

draw();
  
