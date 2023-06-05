class Graph{
    constructor(canvas){ 
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    drawGrid(px, color,thickGrid=0.9){
        setLine(oX,0,oX,this.canvas.height,'black',this.canvas,thickGrid*1.5); //linha eixo y
        setLine(0,oY,this.canvas.width,oY,'black',this.canvas,thickGrid*1.5); //linha eixo x
        for(let x = -this.canvas.width-oX;x<this.canvas.width-oX;x += 1){//linhas y
            if(x%px == 0){
                setLine(oX+x,0,oX+x,this.canvas.height,color,this.canvas,thickGrid);
            }
        }
        for(let y = -this.canvas.height-oY;y<this.canvas.height-oY;y += 1){//linhas x
            if(y%px == 0){
                setLine(0,oY+y,this.canvas.width,oY+y,color,this.canvas,thickGrid);
            } 
        }
        this.ctx.font = "italic 25px Times";
        this.ctx.fillText("tempo (s)",canvasWidth-(5*px),canvasHeight-(2*px));
    }

    drawPoint(x,y,thick = 2){
        this.ctx.beginPath();
        this.ctx.arc(x,y,thick,0,2*Math.PI);
        this.ctx.fill();
    }

    plotFunction(px,funct,colorGrid="grey"){
        this.drawGrid(px,colorGrid);
        let x;
        let y;
        let xAntes = 0;
        let yAntes = 0;
        for(x=-oX;x<this.canvas.width-oX;x += px/100){
            y = eval(funct.expression)
            x == -oX ? this.drawPoint(x+oX,(-y)+oY,thick): setLine(xAntes+oX,-yAntes+oY,x+oX,-y+oY,funct.color,this.canvas,thick);   
            xAntes = x;
            yAntes = y;
        }
    }

    moveGraph(){    
        this.canvas.onmousedown = mouse_down;
        this.canvas.onmouseup = mouse_up;
        this.canvas.onmousemove = mouse_move;
        this.canvas.onmouseout = mouse_up;
    }
    
    coordGraph(xCoord,yCoord){
        let canvas = this.canvas;
        function getMouseCoord(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left - oX,
                y: -1*(evt.clientY - Math.round(rect.top) - oY)
            };
        }
        function coordCalcs(evt){
            var mousePos = getMouseCoord(canvas, evt);
            xCoord.innerHTML = Math.round((((mousePos.x)/px)*100)*xScale)/100;
            yCoord.innerHTML = Math.round((((mousePos.y)/px)*100)/yScale)/100;
        }
        canvas.addEventListener("mousemove",coordCalcs);
    }

    zoom(btnZoomIn,btnZoomOut){
        btnZoomIn.onclick = function(){
            if(px < 500){
                px += 10;
                thick += 0.2;
            }
            else{
                
            }
        }
        btnZoomOut.onclick = function(){
            if(px >= 10){
                px -= 10;
                thick -= 0.2;
            }
            else{
                
            }
        }
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
    }
}
