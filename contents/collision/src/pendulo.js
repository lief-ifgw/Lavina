class Pendulo {
    constructor(pivo, pos, ang_freq, lenght, angle, mass1) {
        this.pivo         = new Vector2D(pivo.x, pivo.y);
        this.pos          = new Vector2D(pos.x, pos.y);
        this.mass         = mass1;
        this.angle        = angle * (Math.PI / 180.0);
        this.ini_angle    = angle * (Math.PI / 180.0);
        this.ang_freq     = ang_freq;
        this.lenght       = lenght;
        this.gravity      = new Vector2D(0,10);
        // this.acceleration = new Vector2D(0, 0);
        // this.velocity     = new Vector2D(0, 0);
    }

    setAngle(angle) {
        this.angle = angle * (Math.PI / 180.0);
    }

    setLenght(l) {
        this.lenght = l;
    }

    setAngularFrequency(af) {
        this.ang_freq = af;
    }

    move(t) {
        this.angle = Math.cos(this.ang_freq * t);

        this.pos = new Vector2D(this.pivo.x - this.lenght * 10 * Math.sin(this.angle),     
                                this.lenght * 10 * Math.cos(this.angle));
    }

    stop(){
        
        this.pos = new Vector2D(this.pivo.x - this.lenght * 10 * Math.sin(this.angle),     
        this.lenght * 10 * Math.cos(this.angle));
    }

    draw(ctx) {
        //ctx.save();
        //ctx.clearRect(0,0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(this.pivo.x,this.pivo.y);
        this.pos = new Vector2D(this.pivo.x - this.lenght * 10.0 * Math.sin(this.angle),     
                                this.lenght * 10.0 * Math.cos(this.angle));

        ctx.lineTo(this.pos.x,this.pos.y);
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,110);
        //this.pos = new Vector2D(this.pivo.x - this.lenght * 10.0 * Math.sin(this.angle),     
        //                        this.lenght * 10.0 * Math.cos(this.angle));

        ctx.lineTo(100,110);
        ctx.lineTo(100,600);
        ctx.lineWidth = 3;
        ctx.stroke();


        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        /* Black border on the circle */
        ctx.lineWidth = 2.5; /* Border width */
        ctx.strokeStyle = 'black'; /* Border color */
        ctx.fill();
        /* Draw the border */
        ctx.stroke();  /* It's necessary only if your are drawing the border */

        //ctx.beginPath();
        //ctx.arc(100, 100, 10, 0, 2 * Math.PI, false);
        //ctx.fillStyle = 'blue';
        /* Black border on the circle */
        //ctx.lineWidth = 2.5; /* Border width */
        //ctx.strokeStyle = 'black'; /* Border color */
        //ctx.fill();
        /* Draw the border */
        //ctx.stroke();  /* It's necessary only if your are drawing the border */

        
    }

}
