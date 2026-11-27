// shots/01_clinic.js — consultório: abertura, cadeira vazia, relatório, "sem promessa", encerramento.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { clinic, clinicGround, chairX, dentalChair } from '../sets/clinic.js';
import { DENT } from '../cast.js';

const rimOf = (M) => ({ color: M.rim, dir: [-1, -0.4], w: 4.5 });

// s01 — "Terça-feira, três da tarde."  wide, push lento, relógio 15h
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1 + 0.07 * k, x: -20 * k };
  const { GY, M } = clinic(g, t, cam);
  layer(g, cam, 1, (g) => dentalChair(g, chairX(), GY, V(1.0, 1.15), M, t));
  FX.dust(g, t, { count: 45, color: '#dff6ff', a: 0.3 });
} });

// s02 — "A cadeira está vazia."  médio: dentista no banquinho olhando a cadeira
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.32 + 0.06 * k, x: 40 - 30 * k, y: -60 };
  const { GY, M } = clinic(g, t, cam);
  const s = V(1.4, 1.5), dx = E.W / 2 - V(300, 200);
  layer(g, cam, 1, (g) => {
    dentalChair(g, chairX() + V(60, 60), GY, V(1.0, 1.15), M, t);
    FX.stool(g, dx, GY, s, shade2(M));
    drawFigure(g, { x: dx, y: GY, s, facing: 1, outfit: DENT, pose: breathe(POSES.sit, t), expr: t < 0.5 ? 'neutral' : 'sad', look: [1, 0.2], rim: rimOf(M), shadow: true, blink: (t % 2.7) > 2.6 });
  });
  blurLayer(g, 10, (g) => { g.fillStyle = alpha(M.practical, 0.25); rr(g, -40, E.H - V(320, 520), 160, 420, 30); g.fill(); }, cam, 1.6);
  FX.dust(g, t, { count: 35, color: '#dff6ff', a: 0.3 });
} });
function shade2(M) { return '#0a1426'; }

// s10 — "E todo mês, um relatório claro:"  dentista recebe o tablet e sorri
registerShot('s10', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.25 + 0.06 * k, x: -30 * k, y: -40 };
  const { GY, M } = clinic(g, t, cam);
  const s = V(1.5, 1.6), x = E.W / 2 - V(80, 60);
  layer(g, cam, 1, (g) => {
    dentalChair(g, chairX() + V(160, 230), GY, V(1.0, 1.15), M, t, false);
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: DENT, pose: breathe(posesAt(t, [[0, POSES.stand], [0.35, POSES.holdFront]]), t), expr: t > 0.7 ? 'happy' : 'neutral', prop: t > 0.35 ? { type: 'tablet', glow: S().ui.gold } : null, rim: rimOf(M), blink: (t % 3.1) > 3.0 });
  });
  const tx = x + V(60, 70) * s / 1.5, ty = GY - V(150, 170) * s / 1.5;
  if (t > 0.45) FX.rings(g, tx, ty, t, { count: 2, r0: 30, r1: 120, color: S().ui.gold, a: 0.35 });
  FX.dust(g, t, { count: 35, color: '#dff6ff', a: 0.3 });
} });

// s12 — "Sem promessa milagrosa."  linha grande sobre o consultório desfocado
registerShot('s12', { draw(g, t, info) {
  blurLayer(g, 14, (g) => { const { GY, M } = clinic(g, t, { z: 1.2 + 0.03 * t }); dentalChair(g, chairX(), GY, V(1.0, 1.15), M, t); });
  veil(g, '#040a16', 0.5);
  const ui = S().ui, a = ease.out(prog(t, 0.05, 0.35)) * Math.min(1, (info.dur - t) / 0.25), sc = 1 + 0.04 * t;
  g.save(); g.globalAlpha *= a; g.translate(E.W / 2, E.H * 0.42); g.scale(sc, sc);
  text(g, 'SEM PROMESSA', 0, -V(60, 70), { size: V(92, 104), color: ui.cream, glow: 26, glowColor: alpha(ui.gold, 0.6), spacing: 3 });
  text(g, 'MILAGROSA', 0, V(60, 70), { size: V(110, 124), color: ui.gold, glow: 30, glowColor: alpha(ui.gold, 0.8), spacing: 4 });
  g.restore();
  FX.dust(g, t, { count: 25, color: '#dff6ff', a: 0.25 });
} });

// s13 — "Fale com a gente no WhatsApp."  dentista acena + pílula; topo livre para o logo (PNG oficial, sobreposto depois)
registerShot('s13', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.05 * k, x: 20 * k, y: -30 };
  const { GY, M } = clinic(g, t, cam);
  layer(g, cam, 1, (g) => {
    dentalChair(g, chairX() + V(120, 170), GY, V(1.0, 1.15), M, t);
    drawFigure(g, { x: E.W / 2 - V(200, 170), y: GY, s: V(1.4, 1.5), facing: 1, outfit: DENT, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3, POSES.wave], [1.6, POSES.relaxed]]), t), expr: 'smile', rim: rimOf(M), blink: (t % 2.9) > 2.8 });
  });
  veil(g, '#040a16', 0.25);
  const ui = S().ui, sp = ease.outBack(prog(t, 0.25, 0.75)), y = E.H * 0.74;
  g.save(); g.translate(E.W / 2, y); g.scale(sp, sp);
  rr(g, -V(330, 380), -V(56, 64), V(660, 760), V(112, 128), V(56, 64)); g.fillStyle = '#1fae5b'; g.fill();
  glow(g, 0, 0, V(400, 460), '#1fae5b', 0.25);
  text(g, 'FALE NO WHATSAPP', 0, 4, { size: V(48, 56), color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 2 });
  g.restore();
  FX.dust(g, t, { count: 30, color: '#dff6ff', a: 0.3 });
} });
