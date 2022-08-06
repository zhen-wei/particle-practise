// 向量
export class Vec2 {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
    toJSON() {
        return {...this};
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    // 設定座標
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    // 移動
    move(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    // 加向量
    add(v: Vec2) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }
    // 減向量
    sub(v: Vec2) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    // 乘向量
    mul(s: number) {
        return new Vec2(this.x * s, this.y * s);
    }
    // 角度
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    // 單位向量
    get unit() {
        return this.mul(1 / this.length);
    }
    // 取得向量長度
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    // 設向量長度
    set length(nv) {
        let temp = this.unit.mul(nv);
        this.set(temp.x, temp.y);
    }
    // 判斷向量相等
    equal(v: Vec2) {
        return this.x === v.x && this.y === v.y;
    }
}