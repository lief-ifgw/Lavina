class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    angle() {
        if (this.x === 0) {
            return (this.y/Math.abs(this.y)) * 90;
        } else {
            return Math.atan(this.y / this.x) * 180 / Math.PI;
        }
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let length = this.length();
        if (length > 0) {
            this.x /= length;
            this.y /= length;
        }
    }

    invert() {
        this.x = -this.x;
        this.y = -this.y;
    }

    incrementBy(v) {
        this.x += v.x;
        this.y += v.y;
    }

    decrementBy(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    scaleBy(k) {
        this.x *= k;
        this.y *= k;
    }

}

Vector2D.distance = function(v1, v2) {
    return Vector2D.subtract(v1, v2).length();
}

Vector2D.angle = function(v1, v2) {
    return Math.acos(Vector2D.dotProduct(v1, v2) / (v1.length() * v2.length()));
}

Vector2D.add = function(v1, v2) {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
}

Vector2D.subtract = function(v1, v2) {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
}

Vector2D.dotProduct = function(v1, v2) {
    return (v1.x * v2.x + v1.y * v2.y);
}

Vector2D.scale = function(v, k) {
    return new Vector2D(v.x * k, v.y * k);
}

Vector2D.inverse = function(v) {
    return new Vector2D(-v.x, -v.y);
}

Vector2D.norma = function(v) {
    if (v.length() === 0) {
        return new Vector2D(0, 0);
    } else {
        return new Vector2D(v.x / v.length(), v.y / v.length());
    }
}
