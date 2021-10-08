export class Forcefield {
    constructor(p) {
        this.p = p;
        this.value = -100;
    }
    affect(particle) {
        let delta = particle.p.sub(this.p);
        let len = this.value / (1 + delta.length);
        let force = delta.unit.mul(len);
        particle.v.move(force.x, force.y);
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.p.x, this.p.y);
        ctx.arc(0, 0, Math.sqrt(Math.abs(this.value)), 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
    }
}
