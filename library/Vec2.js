export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    mul(s) {
        return new Vec2(this.x * s, this.y * s);
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    get unit() {
        return this.mul(1 / this.length);
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set length(nv) {
        let temp = this.unit.mul(nv);
        this.set(temp.x, temp.y);
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
    equal(v) {
        return this.x === v.x && this.y === v.y;
    }
}
