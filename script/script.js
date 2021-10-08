import { Vec2 } from '../library/Vec2.js';
import { Particle } from '../library/Particle.js';
import { Forcefield } from '../library/Forcefield.js';
import { colorSetting } from './colorSetting.js';
import { toColorCode } from '../library/toColorCode.js';
import { createBlobImg } from '../library/createBlobImg.js';
const color2ImageSource = new Map();
const particles = new Set();
const forcefields = [];
const mousePos = new Vec2();
const forces = new Set();
const controls = {
    count: 3,
    randomV: 15,
    randomR: 30,
    ay: 0.2,
    fade: 0.96,
    total: particles.size,
    clearForcefield
};
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const forcefieldsCanvas = document.createElement('canvas');
const forcefieldsCtx = forcefieldsCanvas.getContext('2d');
(async () => {
    forcefieldsCanvas.width = innerWidth;
    forcefieldsCanvas.height = innerWidth;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    document.body.appendChild(forcefieldsCanvas);
    document.body.appendChild(canvas);
    await preRender();
    requestAnimationFrame(update);
    setInterval(fiexdUpdate, 1000 / 50);
    window.addEventListener('dblclick', drawerForce);
    window.addEventListener('mousemove', event => {
        mousePos.set(event.x, event.y);
    });
    window.addEventListener('resize', event => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        forcefieldsCanvas.width = innerWidth;
        forcefieldsCanvas.height = innerHeight;
        drawerForcefields();
    });
})();
const gui = new dat.GUI();
gui.add(controls, "count", 0, 30).step(1);
gui.add(controls, "randomV", 0, 30).step(1);
gui.add(controls, "randomR", 0, 50).step(1);
gui.add(controls, "ay", -1, 1).step(0.01);
gui.add(controls, "fade", 0, 0.99).step(0.01);
const total = gui.add(controls, "total", 0, 5000);
gui.add(controls, 'clearForcefield');
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
async function preRender() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
    const supportBitmap = 'createImageBitmap' in window ? true : false;
    particle.draw(ctx);
    while (g <= maximum.g) {
        while (b < maximum.b) {
            await addBitmap(ctx, particle, r, g, b);
            b += 15;
        }
        await addBitmap(ctx, particle, r, g, b);
        b = 0;
        g += 15;
    }
    async function addBitmap(ctx, particle, r, g, b) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const code = toColorCode(r, g, b);
        particle.color = code;
        particle.draw(ctx);
        if (supportBitmap) {
            const bitmap = await createImageBitmap(canvas);
            color2ImageSource.set(code, bitmap);
        }
        else {
            const img = await createBlobImg(canvas);
            color2ImageSource.set(code, img);
        }
    }
}
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of particles) {
        const bitmap = color2ImageSource.get(particle.color);
        ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, Math.floor(particle.p.x), Math.floor(particle.p.y), Math.floor(particle.width), Math.floor(particle.height));
    }
    stats.update();
    requestAnimationFrame(update);
}
function fiexdUpdate() {
    for (let i = controls.count; i > 0; i--) {
        const args = {
            p: mousePos.clone(),
            v: new Vec2(Math.random() * controls.randomV - controls.randomV / 2, Math.random() * controls.randomV - controls.randomV / 2),
            r: Math.random() * controls.randomR,
            color: toColorCode(255, Math.floor(Math.random() * 17) * 15, Math.floor(Math.random() * 10) * 15)
        };
        const particle = new Particle(args);
        particles.add(particle);
    }
    for (const particle of particles) {
        updateParticle(particle);
        if (particle.dead) {
            particles.delete(particle);
        }
        else {
            for (const forcefield of forcefields) {
                forcefield.affect(particle);
            }
        }
    }
    controls.total = particles.size;
    total.updateDisplay();
}
function updateParticle(particle) {
    if (particle.dead) {
        return;
    }
    particle.r *= controls.fade;
    if (particle.r < 0.1) {
        particle.dead = true;
        return;
    }
    particle.p = particle.p.add(particle.v);
    particle.v = particle.v.add(particle.a);
    particle.v.move(0, controls.ay);
    particle.v = particle.v.mul(0.99);
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
function drawerForce(event) {
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
