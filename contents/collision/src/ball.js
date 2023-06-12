class Ball {
    constructor(pivo, pos, mass1,mass2,h,arrpos) {
        this.pivo         = new Vector2D(pivo.x, pivo.y);
        this.pos          = new Vector2D(pos.x, pos.y);
        this.mass2        = mass2;
        this.mass1        = mass1;
        this.gravity      = new Vector2D(0,10);
        this.h            = h;
        this.arrpos       = arrpos;

        // this.acceleration = new Vector2D(0, 0);
        // this.velocity     = new Vector2D(0, 0);
    }


    //move(t) {
    //   this.angle = Math.cos(1.0 * this.ang_freq * t);
    //}
    move(t){
        //EOM
        var v2 = new Vector2D((2*Math.sqrt(2*10*this.h)*(t*0.08))/(5.4 + 1.0 + parseFloat((this.mass2)/(this.mass1))) , (10*(t*0.08)**2)/2);
        //var v2 = new Vector2D((2*Math.sqrt(2*10*this.h)*(t))/(20*(1.0 + parseFloat((this.mass2)/(this.mass1)))) , (t**2)/(2.3*2));
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
        
        /*Drawing the trajectory*/
        var narr = this.arrpos.push(this.pos);
        //console.log(narr);
        for(var i = 0; i < narr; i = i + 8){

            ctx.rect(this.arrpos[i].x,this.arrpos[i].y,0.5,0.5);
            ctx.stroke();
            //console.log(this.arrpos[i].x,this.arrpos[i].y);
            
        }
        
        
        ctx.fill();
        ctx.stroke();
    }

}
