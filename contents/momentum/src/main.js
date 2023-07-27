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
var clicked = false;

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
var btnRun       = document.getElementById("button-start");
var btnStop      = document.getElementById("button-stop");
var btnReset     = document.getElementById("button-reset");

var solution     = document.getElementById("solution");
var explanation  = document.getElementById("explanation");
var formMomentum = document.getElementById("formMomentum");
var ansMomentum  = document.getElementById("ansMomentum");

var answer       = document.getElementById("answ");

m1View.innerHTML = sliderM1.value;
m2View.innerHTML = sliderM2.value;
v1View.innerHTML = sliderV1.value;

sliderM1.oninput = function(){
  m1View.innerHTML = this.value;
  
}

sliderM2.oninput = function(){
  m2View.innerHTML = this.value;
}

sliderV1.oninput = function(){
  v1View.innerHTML = this.value;
}




var pos1 = new Vector2D(10,200);
var pos2 = new Vector2D(590 ,200)
pivo = new Vector2D(0,200);

//SOLUTION ACCORDION

solution.addEventListener("click", function() {
  if(clicked){
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
      } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
      } 
  }
  else{
      window.alert("Você deve inserir um valor válido para ver a resposta.");
  }
});

/********** Animation ********/
function init() {

  ball1 = new Ball(pivo, pos1, sliderM1.value,color1,sliderV1.value);
  ball2 = new Ball(pivo, pos2, sliderM2.value,color2,-10.0);
  draw();
 }

document.onload = init();

function round(n, precision){
  let factor = 10**precision;
  return parseFloat(Math.round(n*factor)/factor).toFixed(2);
}

// STOPWATCH STUFF

window.onload = function () {
  var seconds = 0o0;
  var tens = 0o0;
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")

  
  var Interval ;

  btnRun.onclick = function() {

          clicked = true;        
          showAns();
          ball1.setMass(sliderM1.value);
          ball1.setV(sliderV1.value);
          ball2.setMass(sliderM2.value);
          ball2.setV(-10.0);
          animate();
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
            alert('Resposta correta!  Re: ' + round(vfin,3) + ' m/s');
          }
          else{
            alert('Resposta incorreta!  Re: ' + round(vfin,3) + ' m/s');
          }
        }
        else{
          if( answer.value >= (vfin + (vfin*0.05)) && answer.value <= (vfin - (vfin*0.05))){
            alert('Resposta correta!  Re: ' + round(vfin,3) + ' m/s');
          }
          else{
            alert('Resposta incorreta!  Re: ' + round(vfin,3) + ' m/s');
          }
        }
      }

    draw();
}

draw();

function showAns(){
  explanation.innerHTML =`Primeiro devemos lembrar das equações de conservação de energia cinética e momento linear:<br><br>
  $\\LARGE{m_{1}(v_{1f}^{2}-v_{1i}^{2})+m_{2}(v_{2f}^{2}-v_{2i}^{2})=0}$<br><br>
  $\\LARGE{m_{1}(v_{1f}-v_{1i})+m_{2}(v_{2f}-v_{2i})=0}$<br><br>
  Desenvolvendo as equações, chegamos em:<br><br>
  $\\LARGE{v_{1f}=v_{2f}+v_{2i}-v_{1i}}$<br><br>
  Onde substituindo na equação de conservação de energia cinética:<br><br>
  $\\LARGE{m_{1}((v_{2f}+v_{2i}-v_{1i})^{2}-v_{1i}^{2})+m_{2}(v_{2f}^{2}-v_{2i}^{2})=0}$<br><br>
  Portanto, agora o valor da velocidade final da bolinha 2 depende apenas de valores que já temos. Remanejando a expressão para isolar
  a velocidade desejada, temos:<br><br>
  $\\LARGE{v_{2f}=\\frac{v_{2i}(m_{2}-m_{1})+2m_{1}v_{1i}}{m_{1}+m_{2}}}$<br><br>
  Substituindo os valores na expressão obtida:<br><br>`
  formMomentum.innerHTML = "$\\LARGE{\\frac{-10("+sliderM2.value+"-"+sliderM1.value+")+2*"+sliderM1.value+"*"+sliderV1.value+"}{"+sliderM1.value+"+"+sliderM2.value+"}}$<br>";
  let v = (-10*(parseInt(sliderM2.value)-parseInt(sliderM1.value))+(2*parseInt(sliderM1.value)*parseInt(sliderV1.value)))/(parseInt(sliderM1.value)+parseInt(sliderM2.value));
  ansMomentum.innerHTML = "$\\large{"+round(v,3)+"}\\,m/s$"; 
  MathJax.typeset();
}