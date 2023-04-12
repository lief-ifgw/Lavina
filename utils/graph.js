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

    plotFunction(px,py,FUNCT,COLORFUNCT,colorGrid="grey",thick = 2, insta = true,canvas = this.canvas,x){
        this.drawGrid(px,py,colorGrid);
        // let x = -oX;
        let y;
        let index = 0;
        let j = 0;
        let xAntes;
        let yAntes;
        let fTransf = [];
        FUNCT.forEach((f) => {
            f = f.replace(/X/g,"(x/px)");
            f = "(" + f + ")*py";
            fTransf.push(f);
        });
        FUNCT = fTransf;
        if(insta){
            FUNCT.forEach((f,i) => {
                for(x=-oX;x<canvas.width-oX;x += px/100){
                    y = eval(f)*(py/px);
                    x == -oX ? {}: setLine(xAntes+oX,-yAntes+oY,x+oX,-y+oY,COLORFUNCT[i],canvas,thick);   
                    xAntes = x;
                    yAntes = y;
                }
            });
        }
        else{
            let y = eval(FUNCT[index])*(py/px);
            let xAntes = x;
            let yAntes = y; 
            if(x !== -oX){
                setLine(xAntes+oX,-yAntes+oY,x+oX,-y+oY,COLORFUNCT[index],canvas,thick);
            }
            //x += px/100;
            if(x >= canvas.width-oX){
                index += 1;
                x = -oX;
            }
            return{index,x};

        }
    }
    fu(f,x,i){
        let y = eval(f)*(py/px);
        let xAntes = x;
        let yAntes = y;
        console.log(x); 
        x == -oX ? this.drawPoint(x+oX,(-y)+oY,thick): setLine(xAntes+oX,-yAntes+oY,x+oX,-y+oY,COLORFUNCT[i],this.canvas,thick);   
        x += px/100;
        console.log(x);
        if(x >= this.canvas.width-oX){
            clearInterval(sett);
        }
    }
    

    // var counter = 0;
    // var i = setInterval(function(){
    //     // do your thing
    
    //     counter++;
    //     if(counter === 10) {
    //         clearInterval(i);
    //     }
    // }, 200);

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
