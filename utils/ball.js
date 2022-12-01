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
        BALLS.push(this);
        this.player = false;
    }
    
    drawBall(color=this.color,num=true,led=false){
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.r,0,2*Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        if(num){
            ctx.beginPath();
            ctx.font = '20pt Arial';
            ctx.fillStyle = "black";
            ctx.fillText(BALLS.indexOf(this)+1,this.pos.x - 8,this.pos.y + 8);
            ctx.closePath();
        }
        if(led){
            let x = (canvasWidth-2*rball)/(wx2-wx1);
            let xball = x*((b.pos.x)-wx1);
            ctx.beginPath();
            ctx.arc(this.pos.x,this.pos.y,this.r/4,0,2*Math.PI);
            ctx.arc(this.pos.x,this.pos.y + 2*this.r,this.r/4,0,2*Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
            c = 0;
        }
        
    }

    reposition(){
        this.a = Vector2D.scale(Vector2D.norma(this.a),this.acceleration);
        this.v = Vector2D.add(this.v,this.a);
        this.v = Vector2D.scale(this.v,1);
        this.pos = Vector2D.add(this.pos,this.v);
    }

}