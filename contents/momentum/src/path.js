class Path {
    constructor(pivo, pos, mass1,mass2,h) {
        this.pivo         = new Vector2D(pivo.x, pivo.y);
        this.pos          = new Vector2D(pos.x, pos.y);
        this.mass2        = mass2;
        this.mass1        = mass1;
        this.gravity      = new Vector2D(0,10);
        this.h            = h;
        // this.acceleration = new Vector2D(0, 0);
        // this.velocity     = new Vector2D(0, 0);
    }


    //move(t) {
    //   this.angle = Math.cos(1.0 * this.ang_freq * t);
    //}
    move(t){
        var v2 = new Vector2D((2*Math.sqrt(2*10*this.h)*(t*0.08))/(1 + (this.mass2)/(this.mass1)) , (10*(t*0.2)**2)/2);
        this.pos = Vector2D.add(this.pos,v2);
        //this.draw();
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
       ctx.fillRect(this.pos.x,this.pos.y,1,1);
    }

}
