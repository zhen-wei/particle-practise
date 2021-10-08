import { Vec2 } from './Vec2.js';
export class Particle {
    constructor(args) {
        this.dead = false;
        if (args) {
            this.p = args.p;
            this.r = args.r;
            this.color = args.color;
            this.v = args.v || new Vec2();
            this.a = args.a || new Vec2();
        }
        else {
            this.p = new Vec2();
            this.v = new Vec2();
            this.a = new Vec2();
            this.r = 10;
            this.color = '#fff';
        }
    }
    [Symbol.toStringTag]() {
        return this.type;
    }
    get width() {
        return this.r * 2;
    }
    get height() {
        return this.width;
    }
    get type() {
        return 'Particle';
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.p.x, this.p.y);
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}
