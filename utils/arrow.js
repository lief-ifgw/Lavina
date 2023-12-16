class Arrow {
    constructor(p, length, theta, color) {
        this.pos = new Vector2D(p.x, p.y);
        this.length = length;
        this.angle = theta;
        this.color = color;
        this.headColor = color;
        this.thickness = 1;
        this.headWidth;
        this.headSize;
    };

    draw(ctx,invert = false) {
        if (invert === true){
            invert = -1; 
        }
        else{
            invert = 1;
        }
        if(this.length > 0) {
            let angle = 1.0 * this.angle * Math.PI / 180.0; //conversão para radianos

            this.headWidth = 2 * this.thickness;
            this.headSize = 4 * this.thickness;

            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(invert*angle);

            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.lineWidth = this.thickness;
            ctx.moveTo(0, 0);
            ctx.lineTo(this.length, 0);
            ctx.stroke();

            ctx.translate(this.length, 0);
            ctx.fillStyle = this.headColor;
            ctx.beginPath();
            ctx.lineTo(0, this.headWidth);
            ctx.lineTo(this.headSize, 0);
            ctx.lineTo(0, -this.headWidth);
            ctx.fill();

            ctx.restore();
        }
    }
}
