class Graph{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        let mouse_down;
        let mouse_up;
        let mouse_move;
    }

    drawGrid(px, py, color,thickGrid=0.9){
        setLine(oX,0,oX,this.canvas.height,'black',this.canvas,thickGrid*1.5); //linha eixo y
        setLine(0,oY,this.canvas.width,oY,'black',this.canvas,thickGrid*1.5); //linha eixo x
        for(let x = -this.canvas.width-oX;x<this.canvas.width-oX;x += 1){//linhas y
            if(x%px == 0){
                setLine(oX+x,0,oX+x,this.canvas.height,color,this.canvas,thickGrid);
            }
        }
        for(let y = -this.canvas.height-oY;y<this.canvas.height-oY;y += 1){//linhas x
            if(y%py == 0){
                setLine(0,oY+y,this.canvas.width,oY+y,color,this.canvas,thickGrid);
            } 
        }
    }

    drawPoint(x,y,thick = 2){
        this.ctx.beginPath();
        this.ctx.arc(x,y,thick,0,2*Math.PI);
        this.ctx.fill();
    }

    plotFunction(px,py,funct,colorFunct="black",colorGrid="grey",thick = 2){
        this.drawGrid(px,py,colorGrid);
        let x;
        let y;
        let xAntes = 0;
        let yAntes = 0;
        funct = funct.replace(/X/g,"(x/px)");
        funct ="(" + funct + ")*py";
        for(x=-oX;x<this.canvas.width-oX;x += px/100){
            y = eval(funct)*(py/px);    
            x == -oX ? this.drawPoint(x+oX,(-y)+oY,thick): setLine(xAntes+oX,-yAntes+oY,x+oX,-y+oY,colorFunct,this.canvas,thick);
            xAntes = x;
            yAntes = y;
        }
        // FUNCT.forEach((f,i) => {
        //     f = f.replace(/X/g,"(x/px)");
        //     f = "(" + f + ")*py";
        //     FUNCT[i] = f;    
        // });
        // for(x=-oX;x<this.canvas.width-oX;x += px/100){
        //     FUNCT.forEach(f => {
        //         y = eval(f)*(py/px);
        //         x == -oX ? this.drawPoint(x+oX,(-y)+oY,thick): setLine(xAntes+oX,-yAntes+oY,x+oX,-y+oY,colorFunct,this.canvas,thick);   
        //         xAntes = x;
        //         yAntes = y;
        //     });
        // }
    }

    moveGraph(){    
        this.canvas.onmousedown = mouse_down;
        this.canvas.onmouseup = mouse_up;
        this.canvas.onmousemove = mouse_move;
        this.canvas.onmouseout = mouse_up;
    }
    
}
setLine = function(x0,y0,xf,yf,color,canvas,lw=1){
    let ctx = canvas.getContext('2d');
    ctx.beginPath();    
    ctx.moveTo(x0,y0);
    ctx.lineTo(xf,yf);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.closePath();
}

let is_dragging = false;

let mouse_down = function(event){
    event.preventDefault();
    startX = parseInt(event.clientX);
    startY = parseInt(event.clientY);
    is_dragging = true;
}

let mouse_up = function(event){
    if(!is_dragging){
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

let mouse_move = function(event){
    if(!is_dragging){
        return;
    }
    else{
        event.preventDefault();
        let mouseX = parseInt(event.clientX);
        let mouseY = parseInt(event.clientY);
        let dx = mouseX - startX;
        let dy = mouseY - startY;
        oX += dx;
        oY += dy;
        startX = mouseX;
        startY = mouseY;
        console.log(oX,oY);
    }
}
