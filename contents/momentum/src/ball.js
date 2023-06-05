class Ball {
    constructor(pivo, pos, mass, color,v) {
        this.pivo         = new Vector2D(pivo.x, pivo.y);
        this.pos          = new Vector2D(pos.x, pos.y);
        this.mass         = mass;
        this.gravity      = new Vector2D(0,10);
        this.color        = color;
        this.v            = v;

        // this.acceleration = new Vector2D(0, 0);
        // this.velocity     = new Vector2D(0, 0);
    }


    //move(t) {
    //   this.angle = Math.cos(1.0 * this.ang_freq * t);
    //}
    move(t){
        //EOM
        var v2 = new Vector2D(0.05*this.v*t,0);
        this.pos = Vector2D.add(this.pos,v2);
    }

    //move1(t,m1,m2,v1){
    //    console.log("%d, %d %d",m1,m2,v1);
    //    var v1f = new Vector2D(0.05*t*(((m1 - m2)/(m1 + m2))*v1 + (2*m2/(m1+m2))*(-10.0 )),0);
    //    console.log(v1f.x);
    //    this.pos = Vector2D.add(this.pos,v1f);
    //}
    
    //move2(t,m1,m2,v1){
    //    var v2f = new Vector2D(0.05*t*(((2*m1)/(m1+m2))*v1 + ((m2 - m1)/(m1+m2))*(-10.0)),0);
    //    console.log(v2f.x);
    //    this.pos = Vector2D.add(this.pos,v2f);
    //}

    setMass(mass){
        this.mass = mass;
    }

    setColor(color){
        this.color = color;
    }

    setV(v){
        this.v = v;
    }

    draw(ctx) {
        

        /* Drawing the ball */
        ctx.beginPath();
        this.pos = new Vector2D(this.pos.x,this.pos.y)
        ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        /* Black border on the circle */
        ctx.lineWidth = 2.5; /* Border width */
        ctx.strokeStyle = 'black'; /* Border color */
    
        
        ctx.fill();
        ctx.stroke();
    }

}
