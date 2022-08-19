function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

Vector2D.prototype = {
    length : function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize : function() {
        let length = this.length();
        if (length > 0 ) {
            this.x /= length;
            this.y /= length;
        }
    },
    invert : function() {
        this.x = -this.x;
        this.y = -this.y;
    },
    add : function(v) {
        return new Vector2D(this.x + v.x, this.y + v.y); 
    },
    subtract : function(v) {
        return new Vector2D(this.x - v.x, this.y - v.y);
    },
    incrementBy : function(v) {
        this.x += v.x;
        this.y += v.y;
    },
    decrementBy : function(v) {
        this.x -= v.x;
        this.y -= v.y;
    },
    scaleBy : function(k) {
        this.x *= k;
        this.y *= k;
    },
    dotProductWith : function(v) {
        return (this.x * v.x + this.y * v.y);
    }
}

Vector2D.distance = function(v1, v2) {
    return v1.subtract(v2).length();
}

Vector2D.angleBetween = function(v1, v2) {
    return Math.acos(v1.dotProductWith(v2) / (v1.length() * v2.length()));
}
