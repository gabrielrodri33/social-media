// shots/02_street.js — o paciente no bairro: caminhando, digitando, decidido, chamando.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, shade, text, FONTS, wordTime } from '/engine/core.js';
import { drawFigure, POSES, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { street } from '../sets/street.js';
import { PAT } from '../cast.js';

// s04 — "Enquanto isso, alguém no seu bairro"  wide: paciente caminha com o celular
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.05 * k, x: 30 - 60 * k };
  const { GY, M } = street(g, t, cam);
  const ph = t * Math.PI * 2 * 0.9, x = E.W * 0.28 + t * 150;
  const pose = { ...walkPose(ph), eF: [16, -150], hF: [26, -170] };
  layer(g, cam, 1, (g) => drawFigure(g, { x, y: GY, s: V(1.1, 1.25), facing: 1, outfit: PAT, pose, expr: 'thinking', look: [0.5, 0.6], prop: { type: 'phone' }, rim: { color: M.rim, dir: [-1, -0.5] } }));
  FX.dust(g, t, { count: 30, color: '#ffe8c8', a: 0.3 });
  FX.lensStreak(g, E.W * 0.3, E.H * 0.3, E.W * 1.2, '#ffe0b0', 0.15);
} });

// phone mock (generic UI, no third-party logos)
function phone(g, cx, cy, w, h, drawScreen) {
  rr(g, cx - w / 2 - 14, cy - h / 2 - 14, w + 28, h + 28, 56); g.fillStyle = '#05080f'; g.fill();
  g.save(); rr(g, cx - w / 2, cy - h / 2, w, h, 44); g.clip(); g.fillStyle = '#0d1a2e'; g.fillRect(cx - w / 2, cy - h / 2, w, h); drawScreen(g, cx - w / 2, cy - h / 2, w, h); g.restore();
  glow(g, cx, cy, w * 1.1, '#7fdcff', 0.12);
}
function handUnder(g, cx, cy, h) {   // thumb + palm silhouette holding the phone from below (sleeve = patient colour)
  const ink = S().ink;
  seg(g, [[cx + 40, cy + h * 0.38], [cx + 140, E.H + 200]], 150, ink);
  seg(g, [[cx + 90, cy + h * 0.62], [cx + 190, E.H + 300]], 190, PAT.color);
}
const searchBar = (g, x, y, w, str, caret) => {
  rr(g, x + 40, y + 160, w - 80, 110, 55); g.fillStyle = '#eaf4fb'; g.fill();
  g.strokeStyle = '#0d1a2e'; g.lineWidth = 6; g.beginPath(); g.arc(x + 110, y + 212, 22, 0, 7); g.stroke(); seg(g, [[x + 126, y + 228], [x + 146, y + 248]], 7, '#0d1a2e');
  text(g, str + (caret ? '|' : ''), x + 160, y + 216, { size: 40, color: '#0d1a2e', font: FONTS.ui, weight: 800, align: 'left' });
};

// s05 — "digita: dentista perto de mim."  insert do celular, digitação sincronizada
registerShot('s05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.6, y: -200 })); veil(g, '#040a16', 0.35);
  const g0 = info.shot.start, a = (wordTime('dentista', g0) ?? g0 + 1) - g0, b = (wordTime('mim', g0) ?? g0 + 2) - g0 + 0.3;
  const full = 'dentista perto de mim', n = Math.round(full.length * clamp((t - a) / (b - a)));
  const cx = E.W / 2, cy = E.H * 0.46 - 20 * ease.inOut(t / info.dur), w = 640, h = 1140;
  phone(g, cx, cy, w, h, (g, x, y, w, h) => {
    searchBar(g, x, y, w, full.slice(0, n), Math.floor(t * 3) % 2 === 0 || n < full.length);
    for (let i = 0; i < 4; i++) { rr(g, x + 40, y + 330 + i * 150, w - 80, 120, 24); g.fillStyle = alpha('#eaf4fb', 0.06); g.fill(); }
  });
  handUnder(g, cx, cy, h);
} });

// s06 — "A pessoa já quer resolver."  close gigante
registerShot('s06', { draw(g, t, info) {
  blurLayer(g, 16, (g) => street(g, t, { z: 1.7, x: -120, y: -160 })); veil(g, '#040a16', 0.35);
  const M = mood('golden'), r = V(300, 330) * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * 0.5, r, { outfit: PAT, expr: 'determined', look: [0.3, 0.1], rimColor: M.rim, rimSide: -1, blink: (t % 2.5) > 2.4 });
} });

// s07 — "E chama no WhatsApp a clínica que encontrar."  resultados -> toque -> conversa
registerShot('s07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.6, y: -200, x: 80 })); veil(g, '#040a16', 0.35);
  const cx = E.W / 2, cy = E.H * 0.46, w = 640, h = 1140, ui = S().ui, tap = 0.9;
  phone(g, cx, cy, w, h, (g, x, y, w, h) => {
    if (t < tap + 0.35) {
      searchBar(g, x, y, w, 'dentista perto de mim', false);
      for (let i = 0; i < 3; i++) { const yy = y + 330 + i * 190, on = i === 0 && t > tap;
        rr(g, x + 40, yy, w - 80, 160, 26); g.fillStyle = on ? alpha(ui.gold, 0.25) : alpha('#eaf4fb', 0.08); g.fill();
        text(g, 'Clínica odontológica', x + 80, yy + 56, { size: 34, color: '#eaf4fb', font: FONTS.ui, weight: 900, align: 'left' });
        rr(g, x + 80, yy + 92, w * 0.45, 14, 7); g.fillStyle = alpha('#eaf4fb', 0.25); g.fill(); }
      if (t > tap - 0.1) FX.rings(g, x + w / 2, y + 410, t - tap, { count: 2, r0: 20, r1: 140, speed: 1.8, color: '#ffffff', a: 0.6 });
    } else {
      const k = ease.outBack(prog(t, tap + 0.35, tap + 0.75));
      g.fillStyle = '#0b2a1e'; g.fillRect(x, y, w, h);
      rr(g, x, y, w, 140, 0); g.fillStyle = '#12452f'; g.fill();
      circle(g, x + 80, y + 76, 34, alpha('#eaf4fb', 0.3)); text(g, 'Clínica', x + 136, y + 78, { size: 38, color: '#eaf4fb', font: FONTS.ui, weight: 900, align: 'left' });
      g.save(); g.translate(x + w - 60, y + 360); g.scale(k, k);
      rr(g, -460, -70, 460, 140, 34); g.fillStyle = '#1fae5b'; g.fill();
      text(g, 'Oi! Quero agendar', -430, -20, { size: 36, color: '#ffffff', font: FONTS.ui, weight: 800, align: 'left' });
      text(g, 'uma avaliação.', -430, 26, { size: 36, color: '#ffffff', font: FONTS.ui, weight: 800, align: 'left' });
      g.restore();
    }
  });
  handUnder(g, cx, cy, h);
} });
