class Wall{
    constructor(x1, y1, x2, y2){
        this.start = new Vector2D(x1, y1);
        this.end = new Vector2D(x2, y2);
        WALLS.push(this);
    }

    drawWall(canvas){
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    wallUnit(){
        return Vector2D.norma(Vector2D.subtract(this.end,this.start));
    }
}