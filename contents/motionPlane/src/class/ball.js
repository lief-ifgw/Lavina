class Ball{
    constructor(name, x, y, r, m=1, color){
        this.name = name;
        this.pos = new Vector2D(x,y);
        this.r = r;
        this.m = m;
        if(this.m === 0){
            this.inv_m = 0;
        }
        else{
            this.inv_m = 1/this.m;
        }
        this.v = new Vector2D(0,0);
        this.a = new Vector2D(0,0);
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

    reposition(){
        this.a = Vector2D.scale(Vector2D.norma(this.a),this.acceleration);
        this.v = Vector2D.add(this.v,this.a);
        this.v = Vector2D.scale(this.v,1-friction);
        this.pos = Vector2D.add(this.pos,this.v);
    }

}