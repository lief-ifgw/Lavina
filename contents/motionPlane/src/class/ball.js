class Ball{
    constructor(name, x, y, r, m=1, color){
        this.name = name;
        this.pos = new Vector(x,y);
        this.r = r;
        this.m = m;
        if(this.m === 0){
            this.inv_m = 0;
        }
        else{
            this.inv_m = 1/this.m;
        }
        this.v = new Vector(0,0);
        this.a = new Vector(0,0);
        this.color = color;
        this.acceleration = 1;
        this.elasticity = 1;
        BALLZ.push(this);
        this.player = false;
    }
    
    drawBall(){
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.r,0,2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    display(){
        this.v.drawVec(800, 400, 5, 'green');
        this.a.normalize().drawVec(800, 400, 50, 'blue');
        this.a.normal().drawVec(800, 400, 50, 'black');
        this.v.mult(-1).normalize().drawVec(800, 400, 50, 'red');
        ctx.beginPath();
        ctx.arc(800,400,50,0,2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    reposition(){
        this.a = this.a.normalize().mult(this.acceleration);
        this.v = this.v.add(this.a);
        this.v = this.v.mult(1-friction);
        this.pos = this.pos.add(this.v);
    }

}