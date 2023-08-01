class Ball{
    constructor(name, x, y, r, m=1){
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
        this.acceleration = 0;
        this.elasticity = 1;
        BALLS.push(this);
        this.player = false;
    }
    
    drawBall(canvas,color,num=true){
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.r,0,2*Math.PI);
        ctx.strokeStyle = "black";
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
        
    }

    reposition(time = 0, v0 = 0, d0 = 0,dimensions=1){
        if(dimensions === 1){
            if(time != undefined){
                this.a = Vector2D.scale(Vector2D.norma(this.a),this.acceleration);
                this.v.x = v0 + this.a.x * time;
                this.pos.x = d0 + this.v.x * time;
            }
        }
        else if(dimensions === 2){
            this.a = Vector2D.scale(Vector2D.norma(this.a),this.acceleration);
            this.v = Vector2D.add(this.v,this.a);
            this.v = Vector2D.scale(this.v,1);
            this.pos = Vector2D.add(this.pos,this.v);    
        }
    }

}