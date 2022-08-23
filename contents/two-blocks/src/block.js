var gravity = new Vector2D(0, 2);

class Block {
    constructor(p, w, h, m, v = 1, color = "blue") {
        this.pos = p;
        this.width = w;
        this.height = h;
        this.mass = m;
        this.velocity = new Vector2D(v, 0);

        this.fillStyle = color;
    }

    move() {
        this.pos.incrementBy(this.velocity);

        if (Math.abs(this.velocity.x) <= 0.01) {
            this.velocity.x = 0;
        }
        if (Math.abs(this.velocity.y) <= 0.01) {
            this.velocity.y = 0;
        }
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
