const gravity = new Vector2D(0, 10);
const canvasWidth = 600;
const canvasHeight = 400;

const blockOneWidth = 150;
const blockOneHeight = 50;
const blockOneMass = 50;

const blockTwoWidth = 50;
const blockTwoHeight = 50;
const blockTwoMass = 50;

const height = 350;
const pos1 = new Vector2D(0, height);
const pos2 = new Vector2D(blockOneWidth / 3, height - blockOneHeight);

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext("2d");

let sliderForce = document.getElementById("force");
let btnRun = document.getElementById("btnRun");

var blockOne = new Block(pos1, blockOneWidth, blockOneHeight, blockOneMass, "red");
var blockTwo = new Block(pos2, blockTwoWidth, blockTwoHeight, blockTwoMass);

var normalTowOnOne = new Vector2D(0, 0);

function dynamics() {
    blockTwo.normal = Vector2D.scale(blockTwo.weight, -1);
    blockTwo.forces = Vector2D.add(blockTwo.weight, blockTwo.normal);

    normalTowOnOne = Vector2D.scale(blockTwo.normal, -1);

    blockOne.normal = Vector2D.add(blockOne.weight, normalTowOnOne);
    blockOne.normal.invert();

    blockOne.forces.incrementBy(blockOne.weight);
    blockOne.forces.incrementBy(blockOne.normal);
    blockOne.forces.incrementBy(normalTowOnOne);
    console.log(blockOne.forces);
}

btnRun.onclick = function() {
    let force = new Vector2D(sliderForce.value / 100, 0);
    blockOne.forces.incrementBy(force);
    dynamics();
}

function animate() {
    blockTwo.move();
    blockOne.move();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    blockOne.draw(ctx);
    blockTwo.draw(ctx);
    ctx.restore();

    requestAnimationFrame(animate);
}

animate()
