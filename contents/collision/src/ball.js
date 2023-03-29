class Ball {
    constructor(pivo, pos, mass1,mass2,h,oldX,oldY) {
        this.pivo         = new Vector2D(pivo.x, pivo.y);
        this.pos          = new Vector2D(pos.x, pos.y);
        this.mass2        = mass2;
        this.mass1        = mass1;
        this.gravity      = new Vector2D(0,10);
        this.h            = h;
        this.oldX         = 100;
        this.oldY         = 100;

        // this.acceleration = new Vector2D(0, 0);
        // this.velocity     = new Vector2D(0, 0);
    }


    //move(t) {
    //   this.angle = Math.cos(1.0 * this.ang_freq * t);
    //}
    move(t){
        //EOM
        var v2 = new Vector2D((2*Math.sqrt(2*10*this.h)*(t*0.08))/(1 + (this.mass2)/(this.mass1)) , (10*(t*0.2)**2)/2);
        this.pos = Vector2D.add(this.pos,v2);
    }

    setMass1(mass1){
        this.mass1 = mass1;
    }

    setMass2(mass2){
        this.mass2 = mass2;
    }

    seth(h){
        this.h = h;
    }

    draw(ctx) {
        
        /* Drawing the ball */
        ctx.beginPath();
        this.pos = new Vector2D(this.pos.x,this.pos.y)
        ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        /* Black border on the circle */
        ctx.lineWidth = 2.5; /* Border width */
        ctx.strokeStyle = 'black'; /* Border color */
        ctx.fill();
        ctx.stroke();

        /*Drawing the trajectory*/
        ctx.beginPath();
        ctx.moveTo(this.oldX,this.oldY);
        ctx.lineTo(this.pos.x,this.pos.y);
        /* Draw the border */
        ctx.stroke();  /* It's necessary only if your are drawing the border */
        this.oldX = this.pos.x;
        this.oldY = this.pos.y;
    }

}
