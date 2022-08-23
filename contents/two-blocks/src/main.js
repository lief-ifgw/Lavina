const canvasWidth = 600;
const canvasHeight = 400;

const blockOneWidth = 150;
const blockOneHeight = 50;
const blockOneMass = 20;

const blockTwoWidth = 50;
const blockTwoHeight = 50;
const blockTwoMass = 10;

const canvas = document.getElementById("myCanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext("2d");

const pos1 = new Vector2D(0, 350);

const pos2 = new Vector2D(blockOneWidth / 3, 350 - blockOneHeight);

var blockOne = new Block(pos1, blockOneWidth, blockOneHeight, blockOneMass, 1, "red");

var blockTwo = new Block(pos2, blockTwoWidth, blockTwoHeight, blockTwoMass);

function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    blockOne.draw(ctx);
    blockTwo.draw(ctx);
    ctx.restore();

    requestAnimationFrame(animate);
}

animate()
