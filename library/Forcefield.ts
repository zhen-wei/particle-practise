import { Vec2 } from './Vec2.js';
import { Particle } from './Particle.js';

export class Forcefield {
    p: Vec2;
    value: number;
    constructor(p: Vec2) {
        this.p = p
        this.value = -100
        // 反比平方用
        // this.value = -1000
    }
    // 引力或吸力
    affect(particle: Particle) {
        // 粒子位置-力場的位置
        let delta = particle.p.sub(this.p);
        // 力場長度（大小） 和距離成反比 (避免除0 所以加1)
        let len = this.value / (1 + delta.length);
        // 力場長度（大小） 和距離成反比平方
        // let len = this.value/(1+Math.pow(delta.length,2));
        // 力場力量（吸力）
        let force = delta.unit.mul(len);
        particle.v.move(force.x, force.y);
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.p.x, this.p.y);
        // 圓半徑 = 開根號（立場大小）
        ctx.arc(0, 0, Math.sqrt(Math.abs(this.value)), 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
    }
}