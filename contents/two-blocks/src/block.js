class Block {
    constructor(p, w, h, m, color = "blue") {
        this.pos = p;
        this.width = w;
        this.height = h;
        this.mass = m;
        this.acceleration = new Vector2D(0, 0);
        this.velocity = new Vector2D(0, 0);
        this.weight = Vector2D.scale(gravity, this.mass);
        this.normal = new Vector2D(0, 0);
        this.forces = new Vector2D(0, 0);
        this.fillStyle = color;
    }

    move() {
        this.acceleration = Vector2D.scale(this.forces, 1.0 / this.mass);
        this.pos.incrementBy(this.velocity);
        this.velocity.incrementBy(this.acceleration);
    }

    draw(ctx) {
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
