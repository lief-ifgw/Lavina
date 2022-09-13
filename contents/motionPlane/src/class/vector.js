class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(v){
        return new Vector(this.x+v.x, this.y+v.y);
    }

    subtract(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }

    length(){
        return Math.sqrt(this.x**2 + this.y**2);
    }

    mult(n){
        return new Vector(this.x*n, this.y*n);
    }

    angle(v1, v2) {
        return Math.acos((v1.x*v2.x + v1.y*v2.y) / (v1.length() * v2.length()));
    }

    drawVec(start_x, start_y, n, color){
        ctx.beginPath();
        ctx.moveTo(start_x,start_y);
        ctx.lineTo(start_x+this.x * n, start_y+this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    normalize(){
        if(this.length() === 0){
            return new Vector(0,0);
        }
        else{
            return new Vector(this.x/this.length(), this.y/this.length());
        }
    }

    normal(){
        return new Vector(-this.y, this.x).normalize();
    }

    static dotProduct(v1, v2){
        return (v1.x*v2.x + v1.y*v2.y);
    }
}