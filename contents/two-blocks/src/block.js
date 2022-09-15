class Block {
    constructor(p, w, h) {
        this.color = "gray";
        this.height = h;
        this.mass = 1.0;
        this.pos = p;
        this.width = w;
        this.acceleration = new Vector2D(0, 0);
        this.forces = new Vector2D(0, 0);
        this.normal = new Vector2D(0, 0);
        this.velocity = new Vector2D(0, 0);
        this.weight = new Vector2D.scale(gravity, this.mass);
    }

    move() {
        this.acceleration = Vector2D.scale(this.forces, 1.0 / this.mass);
        this.pos.incrementBy(Vector2D.scale(this.velocity, 0.001));
        this.velocity.incrementBy(this.acceleration);
    }

    getAcceleration() {
        this.acceleration = Vector2D.scale(this.forces, 1.0 / this.mass);
        return this.acceleration;
    }

    setMass(m) {
        this.mass = m;
        this.weight = new Vector2D.scale(gravity, this.mass);
    }

    draw(ctx) {
        this.fillStyle = this.color;
        this.move();
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.restore();
    }
}
