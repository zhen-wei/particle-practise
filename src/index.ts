import './style.css';
import Stats from 'stats.js';
import { GUI } from 'dat.gui';
import { Vec2 } from './util/Vec2';
import { Particle, ParticleArgs } from './util/Particle';
import { Forcefield } from './util/Forcefield';
import { colorSetting } from './colorSetting.js';
import { toColorCode } from './util/toColorCode.js';

/** 預渲染所有各種圓色的圓形 減少呼叫繪圖api */
const color2ImageSource: Map<string, ImageBitmap> = new Map();

/** 粒子集合 */
const particles: Set<Particle> = new Set();
/** 斥力場集合 */
const forcefields: Forcefield[]= [];
/** 滑鼠位置 */
const mousePos = new Vec2();

// 控制
const controls = {
    // 粒子數量
    count: 3,
    // 隨機速度值
    randomV: 15,
    // 隨機大小
    randomR: 30,
    // 重力
    ay: 0.2,
    // 粒子縮小倍率
    fade: 0.96,
    total: particles.size,
    clearForcefield 
};

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// 建立一個立場用畫布 (分開render)
const forcefieldsCanvas = document.createElement('canvas');
const forcefieldsCtx = forcefieldsCanvas.getContext('2d') as CanvasRenderingContext2D;

(
    async () => {
        forcefieldsCanvas.width = innerWidth;
        forcefieldsCanvas.height = innerWidth;
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        document.body.appendChild(forcefieldsCanvas);
        document.body.appendChild(canvas);
        
        await preRender();

        requestAnimationFrame(update);

        setInterval(fiexdUpdate, 1000/50);

        window.addEventListener('dblclick', drawerForce);
        window.addEventListener('mousemove', event => {
            mousePos.set(event.x, event.y);
        });
        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            forcefieldsCanvas.width = innerWidth;
            forcefieldsCanvas.height = innerHeight;
            drawerForcefields();
        });
    }
)();

/** ============ 控制項與fps ============ */

const gui = new GUI();
gui.add(controls, "count", 0, 100).step(1);
gui.add(controls, "randomV", 0, 30).step(1);
gui.add(controls, "randomR", 0, 50).step(1);
gui.add(controls, "ay", -1, 1).step(0.01);
gui.add(controls, "fade", 0, 0.99).step(0.01);
const total = gui.add(controls, "total", 0, 80000);
gui.add(controls, 'clearForcefield');

const stats = new Stats();
stats.showPanel(0);

document.body.appendChild(stats.dom);

/** ==================================== */

async function preRender() {    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = 64;
    canvas.height = 64;
    const center = canvas.width * 0.5;
    
    const particle = new Particle({
        p: new Vec2(center, center),
        r: canvas.width * 0.5,
        color: '#fff'
    });
    const maximum = colorSetting.maximum;
    let [r, g, b] = [255, 0, 0];
    
    // 繪製風力場的圖標
    particle.draw(ctx);

    while(g <= maximum.g) {    
        while(b < maximum.b) {
            await addBitmap(ctx, particle, r,g,b);
            b+=15;
        }
        await addBitmap(ctx, particle, r,g,b);
        b = 0;
        g+=15;
    }
    async function addBitmap(ctx: CanvasRenderingContext2D, particle: Particle, r: number, g: number, b:number) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const code = toColorCode(r,g,b);
        particle.color = code;
        particle.draw(ctx);
        const bitmap = await createImageBitmap(canvas);
        color2ImageSource.set(code, bitmap);
    }
}


function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(const particle of particles) {
        const bitmap = color2ImageSource.get(particle.color);
        if (bitmap) {
            ctx.drawImage(
                bitmap,
                0,
                0,
                bitmap.width,
                bitmap.height,
                Math.floor(particle.p.x),
                Math.floor(particle.p.y),
                Math.floor(particle.width),
                Math.floor(particle.height)
            );
        }
    }
    stats.update();
    requestAnimationFrame(update);
}

function fiexdUpdate() {
    // 先更新已有粒子
    for (const particle of particles) {
        updateParticle(particle);
        if (particle.dead) {
            particles.delete(particle);
        } else {
            for (const forcefield of forcefields) {
                forcefield.affect(particle);
            }
        }
    }
    // 加入新粒子並更新
    for (let i = controls.count; i > 0; i--) {
        const args: ParticleArgs = {
            p: mousePos.clone(),
            v: new Vec2(Math.random() * controls.randomV - controls.randomV / 2,
                Math.random() * controls.randomV - controls.randomV / 2),
            r: Math.random() * controls.randomR,
            color: toColorCode(255, Math.floor(Math.random()*17)*15, Math.floor(Math.random()*10)*15)
        }
        const particle = new Particle(args);
        updateParticle(particle);
        if (particle.dead) {
            particles.delete(particle);
        } else {
            for (const forcefield of forcefields) {
                forcefield.affect(particle);
            }
            particles.add(particle);
        } 
    }
    controls.total = particles.size;
    total.updateDisplay();
}


function updateParticle(particle: Particle) {
    // 隨時間縮小
    particle.r *= controls.fade;

    // 當小於0.1時刪除 (壽命到了)
    if (particle.r < 0.1) {
        particle.dead = true;
        return;
    }

    // 位置 = 位置+速度
    particle.p = particle.p.add(particle.v);
    // 速度 = 速度+加速度
    particle.v = particle.v.add(particle.a);
    // 重力場
    particle.v.move(0, controls.ay);
    // 摩擦力（衰減）
    particle.v = particle.v.mul(0.99);
    
    // 粒子碰撞 (邊界)
    if (particle.p.y + particle.r > canvas.height) {
        particle.v.y = -Math.abs(particle.v.y);
    }
    if (particle.p.x + particle.r > canvas.width) {
        particle.v.x = -Math.abs(particle.v.x);
    }
    if (particle.p.y - particle.r < 0) {
        particle.v.y = Math.abs(particle.v.y);
    }
    if (particle.p.x - particle.r < 0) {
        particle.v.x = Math.abs(particle.v.x);
    }
}

function drawerForce(event: MouseEvent) {
    const p = new Vec2(event.x, event.y);
    const forcefield = new Forcefield(p);
    forcefields.push(forcefield);
    forcefield.draw(forcefieldsCtx);
}

function drawerForcefields() {
    forcefieldsCtx.clearRect(0, 0, forcefieldsCanvas.width, forcefieldsCanvas.height);
    for (const forcefield of forcefields) {
        forcefield.draw(forcefieldsCtx);
    }
}

function clearForcefield() {
    forcefields.length = 0;
    forcefieldsCtx.clearRect(0, 0, forcefieldsCanvas.width, forcefieldsCanvas.height);
}