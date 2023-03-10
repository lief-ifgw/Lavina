class Ball {
    constructor(pivo, pos, mass2) {
        this.pivo         = new Vector2D(pivo.x, pivo.y);
        this.pos          = new Vector2D(pos.x, pos.y);
        this.mass         = mass2;
        this.gravity      = new Vector2D(0,10);
        // this.acceleration = new Vector2D(0, 0);
        // this.velocity     = new Vector2D(0, 0);
    }


    //move(t) {
    //   this.angle = Math.cos(1.0 * this.ang_freq * t);
    //}

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(100, 100, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        /* Black border on the circle */
        ctx.lineWidth = 2.5; /* Border width */
        ctx.strokeStyle = 'black'; /* Border color */
        ctx.fill();
        /* Draw the border */
        ctx.stroke();  /* It's necessary only if your are drawing the border */
    }

}
