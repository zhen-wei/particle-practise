import { Vec2 } from './Vec2.js';

export interface ParticleArgs {
    /** 位置 */
    p: Vec2;
    /** 速率 */
    v?: Vec2;
    /** 加速度 */
    a?: Vec2;
    /** 半徑 */
    r: number;
    /** 顏色 */
    color: string;
}

/** 粒子 */
export class Particle implements ParticleArgs {
    p: Vec2;
    v: Vec2;
    a: Vec2;
    r: number;
    color: string;
    dead: boolean = false;
    constructor(args?: ParticleArgs) {
        if (args) {
            this.p = args.p;
            this.r = args.r;
            this.color = args.color;
            this.v = args.v || new Vec2();
            this.a = args.a || new Vec2();
        } else {
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
        return this.r*2;
    }
    get height() {
        return this.width;
    }
    get type() {
        return 'Particle';
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.p.x, this.p.y);
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}