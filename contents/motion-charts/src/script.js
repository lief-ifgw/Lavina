/////////////////////////////////
/*         CANVAS INFO         */

const canvasWidth = 500;
const canvasHeight = canvasWidth*0.75;
const panelHeight = 2*canvasHeight;
const canvasGraph = document.getElementById("myCanvas");
const canvasObject = document.getElementById("objectCanvas");
canvasObject.width = canvasWidth;
canvasObject.height = canvasHeight; 
canvasGraph.width = canvasWidth;
canvasGraph.height = canvasHeight;
var ctxGraph = canvasGraph.getContext('2d');
var ctxObject = canvasObject.getContext('2d');
document.getElementById("control-panel").style.height = panelHeight+"px";

/////////////////////////////////
/*      ATRIBUIÇÃO DE IDS      */

// let zoomIn = document.getElementById("btnZoomIn");
// let zoomOut = document.getElementById("btnZoomOut");
let btnStart = document.getElementById("btnStart");
let btnPause = document.getElementById("btnPause");
let btnReset = document.getElementById("btnReset");
let btnAplicar = document.getElementById("btnAplicar");
let btnConfirm = document.getElementById("btnConfirm");
let answer = document.getElementById("answer");
let xCoord = document.getElementById("xCoord");
let yCoord = document.getElementById("yCoord");
var appendTens = document.getElementById("tens");
var appendSeconds = document.getElementById("seconds");
var labelDx = document.getElementById("dx");
var labelV = document.getElementById("v");
var labelA = document.getElementById("a");
var labelx0 = document.getElementById("labelx0");
var labelv0 = document.getElementById("labelv0");
var solution = document.getElementById("solution");
var legenda = document.getElementById("legenda");
var explanation = document.getElementById("explanation");
var sliderDx = document.getElementById("sliderDx");
var sliderV = document.getElementById("sliderV");
var sliderA = document.getElementById("sliderA");

/////////////////////////////////
/*   DECLARAÇÃO DE VARIÁVEIS   */

let running = false;
var Interval;
let clicked = false;
let px = 20;
let xScale = 1;
let yScale = 1/2;
let oX = px;
let oY = canvasHeight - 3*px;
let mouseX;
let mouseY;
let thick = 2;
let color = ['blue','red','green'];
let x = -oX;
let rball = 10;
let d0 = rball;
let v0 = 0;
let a = 0;
sliderDx.value = 0;
sliderV.value = 0;
sliderA.value = 0;
let friction = 0;
let xGraphDx = oX;
let yGraphDx;
let xAntesDx, yAntesDx;
let xGraphV = oX;
let yGraphV;
let xAntesV, yAntesV;
let xGraphA = oX;
let yGraphA;
let xAntesA, yAntesA;
var velo;
var time;
var seconds = 00;
var tens = 00;
var dez = 00;
var Interval;
let BALLS = [];
let FUNCTIONS = [];
let WALLS = [];

/////////////////////////////////
/*      CLASSES E FUNÇÕES      */

class Function {
    constructor(expression,color){
        this.expression = expression;
        this.color = color;
        FUNCTIONS.push(this);
    }

    adaptToGraph(){
        this.expression = ("(") + this.expression.replace(/x/g,"(x/px)") + (")*px");
    }
}

function round(n, precision){
    let factor = 10**precision;
    return parseFloat(Math.round(n*factor)/factor).toFixed(2);
}

function pause(animId) {
    cancelAnimationFrame(animId);
}

function animateGraph() {
    animGraphId = requestAnimationFrame(animateGraph);
    graphLoop();
}

function animateObject(){
    animObjectId = requestAnimationFrame(animateObject);
    objectLoop();
}

function graphLoop() {
    ctxGraph.save();
    if(ball1.pos.x >= canvasWidth - rball){
        ball1.pos.x = canvasWidth - rball;
        freeze();
        btnPause.disabled = true;
        btnStart.disabled = true;
        if(answer.value <= time + 0.05 && answer.value >= time - 0.05){
            answer.className = "correct";
        }
        else{
            answer.className = "wrong";
        }
    }
    if(tens <= 9){
        dez = "0" + tens;
    }
    
    if (tens > 9){
        dez = tens;
    }
    time = parseFloat(String(seconds)+"."+String(dez));
    //ctxGraph.clearRect(0,0,canvasWidth,canvasHeight); 
    //graph1.plotFunction(px,funct1,"#888888");
    let pos = ball1.pos.x; 
    let v = ball1.v.x;
    let a = ball1.a.x;
    let xGraph = time * px + oX;
    labelDx.innerHTML = round((pos-rball)/px,1);
    labelV.innerHTML = round(v/px,2);
    labelA.innerHTML = round(a/px,2);

    yGraphDx = (pos-rball)*yScale;
    xGraph == oX ? {}: setLine(xAntesDx,-yAntesDx+oY,xGraph,-yGraphDx+oY,color[0],canvasGraph,thick);   
    xAntesDx = xGraph;
    yAntesDx = yGraphDx;

    yGraphV = v*yScale;
    xGraph == oX ? {}: setLine(xAntesV,-yAntesV+oY,xGraph,-yGraphV+oY,color[1],canvasGraph,thick);   
    xAntesV = xGraph;
    yAntesV = yGraphV;

    yGraphA = a*yScale;
    xGraph == oX ? {}: setLine(xAntesA,-yAntesA+oY,xGraph,-yGraphA+oY,color[2],canvasGraph,thick);   
    xAntesA = xGraph;
    yAntesA = yGraphA;
    
    ball1.reposition(time,v0,d0,1);
    //graph1.drawGrid(px,'grey',1);  
    ctxGraph.restore();
}

function objectLoop(){
    ctxObject.save();
    ctxObject.clearRect(0,0,canvasWidth,canvasHeight);

    ball1.drawBall(canvasObject,color[0],false);
    drawBridge();
    if(collisionDetectionWall(ball1, wall1)){
        penetrationResultWall(ball1, wall1);
        collisionResultWall(ball1, wall1);
    }
    

    //ball1.reposition();
    ctxObject.restore();
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
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9){
        appendSeconds.innerHTML = seconds;
    }

}

function closestPointBW(obj1, w1){  
    let ballToWallStart = Vector2D.subtract(w1.start,obj1.pos);
    if(Vector2D.dotProduct(w1.wallUnit(), ballToWallStart) > 0){
        return w1.start;
    }

    let wallEndToBall = Vector2D.subtract(obj1.pos,w1.end);
    if(Vector2D.dotProduct(w1.wallUnit(), wallEndToBall) > 0){
        return w1.end;
    }

    let closestDist = Vector2D.dotProduct(w1.wallUnit(), ballToWallStart);
    let closestVect = Vector2D.scale(w1.wallUnit(),closestDist);
    return Vector2D.subtract(w1.start,closestVect);
}

function collisionDetectionWall(obj1,w1){
    let ballClosest = Vector2D.subtract(closestPointBW(obj1,w1),obj1.pos);
    if(ballClosest.length() <= obj1.r){
        return true;
    }
}

function penetrationResultWall(obj1, w1){
    let penVect = Vector2D.subtract(obj1.pos,closestPointBW(obj1, w1));
    obj1.pos = Vector2D.add(obj1.pos, Vector2D.scale(Vector2D.norma(penVect),obj1.r-penVect.length()));
}

function collisionResultWall(obj1, w1){ 
    let normal = Vector2D.norma(Vector2D.subtract(obj1.pos,closestPointBW(obj1, w1)));
    let sepVel = Vector2D.dotProduct(obj1.v, normal);
    let new_sepVel = -sepVel * obj1.elasticity;
    let vsep_diff = sepVel - new_sepVel;
    obj1.v = Vector2D.add(obj1.v,Vector2D.scale(normal,-vsep_diff));
    obj1.v = Vector2D.scale(obj1.v,1-friction);
}

function freeze(){
    if(running) {
        running = false;
        pause(animObjectId);
        pause(animGraphId);
        clearInterval(Interval);
    }
}

function drawBridge(){
    wall1.drawWall(canvasObject);
    
    for(let i = -canvasWidth; i < canvasWidth; i+=3){
        ctxObject.beginPath();
        ctxObject.moveTo(i,canvasHeight/2);
        ctxObject.lineTo(i+190,canvasHeight);
        ctxObject.strokeStyle = "black";
        ctxObject.stroke();
        ctxObject.closePath();

        ctxObject.beginPath();
        ctxObject.moveTo(i,canvasHeight);
        ctxObject.lineTo(i+190,canvasHeight/2);

        ctxObject.strokeStyle = "black";
        ctxObject.stroke();
        ctxObject.closePath();
    }

    ctxObject.beginPath();    
    ctxObject.ellipse(canvasWidth/2, canvasHeight + 50, canvasWidth/2, canvasHeight/2, 0, 0, 2*Math.PI);
    ctxObject.stroke();
    ctxObject.fillStyle = "white";
    ctxObject.fill();
    ctxObject.closePath();
    

}

btnStart.onclick = function() {
    if(!running) {
        running = true;
        clicked = true;
        animateGraph();
        animateObject();
        btnStart.disabled = true;
        btnPause.disabled = false;
        // zoomIn.disabled = true;
        // zoomOut.disabled = true;
        btnAplicar.scrollIntoView({ behavior: "smooth", block: "center"});
        if(a === 0){
            explanation.innerHTML =`Primeiro é preciso saber como podemos relacionar o tempo com os valores que sabemos.<br>
            No caso acima, a aceleração é igual a zero, portanto a velocidade será sempre a mesma (será constante), então podemos partir da função horária do espaço:<br><br>
            $\\LARGE{x=x_{0}+v_{0}t+\\frac{at^{2}}{2} \\quad \\Delta x=x-x_{0}}$<br><br>
            Como \${a}$ é igual a 0, podemos reescrever a função da seguinte forma:<br><br>
            $\\LARGE{x=x_{0}+v_{0}t+\\frac{0*t^{2}}{2} \\Rightarrow t=\\frac{\\Delta x}{v_{0}}}$<br><br>`
            let t = (((canvasWidth-rball)/px)-(d0/px))/(v0/px);
            formGraph.innerHTML = "$\\LARGE{\\frac{"+round(((canvasWidth-rball)/px)-(d0/px),2)+"[m]}{"+round(v0/px,2)+"[ms^{-1}]} \\approx "+round(t,2)+"[s]}$";
            ansGraph.innerHTML = "$\\large{"+round(t,2)+"}\\,s$"; 
        }
        else{
            explanation.innerHTML = `No caso acima, a aceleração é diferente de zero, portanto a velocidade irá variar, então podemos partir da função horária do espaço:<br><br>
            $\\LARGE{x=x_{0}+v_{0}t+\\frac{at^{2}}{2} \\quad \\Delta x=x-x_{0}}$<br><br>
            Considerando o fator de correção por 2, podemos desenvolver o seguinte:<br><br>
            $\\LARGE{at^{2}+v_{0}t-\\Delta x=0}$<br><br>
            A qual é uma equação de 2º grau, pois queremos apenas o valor de t.<br>
            <br>Utilizando a fórmula de Bhaskara, temos:<br><br>
            $\\LARGE{t = \\frac{-v_{0}+\\sqrt{v_{0}^{2}+4a\\Delta x}}{2a}}$<br> Onde trabalhamos apenas com valores positivos por estarmos falando de tempo<br><br>`;
            let t = (-(v0/px)+Math.sqrt(Math.pow((v0/px),2)+4*(a/px)*(((canvasWidth-rball)/px)-(d0/px))))/(2*(a/px));
            formGraph.innerHTML = "$\\LARGE{\\frac{-"+round(v0/px,2)+"[ms^{-1}]+\\sqrt{("+round(v0/px,2)+"[ms^{-1}])^{2}+4*"+round(a/px,2)+"[ms^{-2}]*"+round((parseFloat(canvasWidth-rball)/px)-(parseFloat(d0)/px),2)+"[m]}}{2*"+round(a/px,2)+"[ms^{-2}]} \\approx "+round(t,2)+"[s]}$";
            ansGraph.innerHTML = "$\\large{"+round(t,2)+"}\\,s$";
        }
        
        MathJax.typeset();
    }
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10);
}

btnPause.onclick = function(){
    freeze();
    btnPause.disabled = true;
    btnStart.disabled = false;
    // zoomIn.disabled = false;
    // zoomOut.disabled = false;
}

btnReset.onclick = function() {
    document.location.reload();
}

btnAplicar.onclick = function() {
    sliderDx.disabled = true;
    sliderV.disabled = true;
    sliderA.disabled = true;
    btnAplicar.disabled = true;
    btnConfirm.disabled = false;
    answer.disabled = false;
    answer.focus();
    btnConfirm.scrollIntoView({ behavior: "smooth", block: "center"});
}

btnConfirm.onclick = function() {
    if(Number(answer.value) == answer.value){
        btnStart.disabled = false;
        btnConfirm.disabled = true;
        answer.disabled = true;
        labelx0.innerHTML = "$x:$";
        labelv0.innerHTML = "$v:$";
        btnStart.click();
    }
    else{
        window.alert("Digite apenas valores numéricos.");
    }
}

answer.addEventListener("keypress", function(e){
    if (e.key === "Enter") {
      e.preventDefault();
      btnConfirm.click();
    }
})


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

legenda.addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    });

sliderDx.oninput = function(){
    if(!running){
        d0 = parseFloat(sliderDx.value)+rball;
        labelDx.innerHTML = (d0-rball)/px;
        ball1.pos.x = d0;
        objectLoop();
    }
}

sliderV.oninput = function(){
    if(!running){
        v0 = parseFloat(sliderV.value*px);
        labelV.innerHTML = v0/px;
        ball1.v.x = v0;
    }
}

sliderA.oninput = function(){
    if(!running){
        a = parseFloat(sliderA.value*px);
        labelA.innerHTML = a/px;
        ball1.acceleration = a;
    }
}

/////////////////////////////////
/* CHAMADA DE MÉTODOS E OBJETOS*/ 
let funct1 = new Function("Math.cos(x)",color[0]);
let graph1 = new Graph(canvasGraph);
let wall1 = new Wall(0,canvasHeight/2,canvasWidth,canvasHeight/2);
let ball1 = new Ball("ball1",d0,(canvasHeight/2)-rball,rball,1);
ball1.drawBall(canvasObject,color[0],false);
//ball1.v.x = v0*px;
ball1.a.x = 1;
//ball1.acceleration = a*px;
ball1.elasticity = 0;
//graph1.moveGraph();  
graph1.drawGrid(px,'lightgrey',1);
// graph1.zoom(zoomIn,zoomOut);
graph1.coordGraph(xCoord,yCoord);
funct1.adaptToGraph();
btnPause.disabled = true;
btnStart.disabled = true;
btnConfirm.disabled = true;
answer.value = "";
answer.placeholder = "Ex.: 4.23";
answer.disabled = true;
sliderDx.max = canvasWidth - 2*rball - 1;
sliderDx.step = 1;
drawBridge();

/////////////////////////////////
/*  NOTAS, TAREFAS E RECADOS *//*
-Tornar a interface mais amigável, com um botão de confirmar os valores que serão calculados: feito
-projetar a verificação de resposta: feito
-projetar soluções para a = 0 (evitar divisão por 0): feito
-Criar a solução em latex: feito
-corrigir a equação (ausência do termo dividindo por 2): feito
-corrigir a repetição adicional do loop
-mudar variáveis: feito
-adicionar unidades no cálculo das soluções: feito
-adicionar legendas para cada função no gráficos: feito
*/
