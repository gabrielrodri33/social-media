// shots/03_info.js — blueprint: agenda vazia, três canais, relatório (sem números inventados).
import { E, V, S, registerShot, ease, prog, clamp, lerp, rr, seg, circle, ring, glow, alpha, text, FONTS, wordTime } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

// s03 — "E horário vago no meio da semana custa caro."
registerShot('s03', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), g0 = info.shot.start;
  const tVago = (wordTime('vago', g0) ?? g0 + 0.6) - g0, tCaro = (wordTime('caro', g0) ?? g0 + 1.8) - g0;
  const z = 1 + 0.05 * ease.inOut(t / info.dur); g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'], x0 = 110, cw = (E.W - 220) / 5, y0 = E.H * 0.26, rh = 120, rows = 6;
  text(g, 'AGENDA DA SEMANA', E.W / 2, y0 - 110, { size: 46, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0, 0.3)) });
  const empty = new Set(['1-2', '1-3', '2-1', '2-2', '2-4', '1-5', '2-5']);
  days.forEach((d, i) => {
    text(g, d, x0 + cw * (i + 0.5), y0 - 30, { size: 38, color: alpha(c, 0.9), font: FONTS.ui, weight: 900 });
    for (let j = 0; j < rows; j++) { const k = ease.out(prog(t, 0.05 * (i + j), 0.05 * (i + j) + 0.3)); if (k <= 0) continue;
      const vago = empty.has(`${i}-${j}`), x = x0 + cw * i + 10, y = y0 + j * rh + 10, w = cw - 20, h = rh - 20;
      rr(g, x, y, w, h, 14);
      if (vago && t > tVago) { const blink = 0.55 + 0.45 * Math.sin((t - tVago) * 9); g.fillStyle = alpha(ui.accent, 0.18 + 0.2 * blink); g.fill(); g.strokeStyle = alpha(ui.accent, 0.9); g.lineWidth = 3; g.stroke(); if (t > tVago + 0.1) glow(g, x + w / 2, y + h / 2, 70, ui.accent, 0.25 * blink); }
      else if (vago) { g.strokeStyle = alpha(c, 0.4); g.lineWidth = 2; g.stroke(); }
      else { g.fillStyle = alpha(c, 0.28 * k); g.fill(); }
    }
  });
  if (t > tVago) text(g, 'HORÁRIO VAGO', E.W / 2, y0 + rows * rh + 90, { size: 66, color: ui.accent, font: FONTS.title, weight: 700, spacing: 3, glow: 20, glowColor: alpha(ui.accent, 0.6), alpha: ease.out(prog(t, tVago, tVago + 0.25)) });
  if (t > tCaro) text(g, 'CUSTA CARO', E.W / 2, y0 + rows * rh + 180, { size: 54, color: ui.cream, font: FONTS.title, weight: 700, spacing: 3, alpha: ease.out(prog(t, tCaro, tCaro + 0.25)) });
  g.restore();
} });

// icons (generic line art; no third-party logos)
function searchIcon(g, x, y, r, c) { ring(g, x - r * 0.15, y - r * 0.15, r * 0.5, 7, c); seg(g, [[x + r * 0.22, y + r * 0.22], [x + r * 0.6, y + r * 0.6]], 9, c); }
function pageIcon(g, x, y, r, c) { g.strokeStyle = c; g.lineWidth = 6; rr(g, x - r * 0.6, y - r * 0.7, r * 1.2, r * 1.4, 10); g.stroke(); seg(g, [[x - r * 0.6, y - r * 0.38], [x + r * 0.6, y - r * 0.38]], 5, c); for (let i = 0; i < 3; i++) seg(g, [[x - r * 0.38, y - r * 0.08 + i * r * 0.24], [x + r * (i === 2 ? 0.1 : 0.38), y - r * 0.08 + i * r * 0.24]], 5, c); }
function cameraIcon(g, x, y, r, c) { g.strokeStyle = c; g.lineWidth = 6; rr(g, x - r * 0.65, y - r * 0.5, r * 1.3, r * 1.05, r * 0.3); g.stroke(); ring(g, x, y + r * 0.02, r * 0.3, 6, c); circle(g, x + r * 0.38, y - r * 0.27, 6, c); }

// s09 — "Google, página e Instagram."
registerShot('s09', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), g0 = info.shot.start, gold = ui.gold;
  const T = ['Google', 'pgina', 'Instagram'].map((w, i) => (wordTime(w, g0) ?? g0 + 0.2 + i * 0.7) - g0);
  const ys = [E.H * 0.24, E.H * 0.43, E.H * 0.62], xI = E.W * 0.3, R = 100, icons = [searchIcon, pageIcon, cameraIcon], labels = ['GOOGLE', 'PÁGINA', 'INSTAGRAM'];
  const drift = 30 * ease.inOut(t / info.dur);
  ys.forEach((y0, i) => { const y = y0 - drift, on = ease.outBack(prog(t, T[i] - 0.1, T[i] + 0.3)), lit = t > T[i], col = lit ? gold : alpha(c, 0.45);
    if (i < 2) { g.setLineDash([10, 12]); seg(g, [[xI, y + R + 10], [xI, ys[i + 1] - drift - R - 10]], 3, alpha(c, 0.35)); g.setLineDash([]); }
    g.save(); g.translate(xI, y); g.scale(0.6 + 0.4 * on, 0.6 + 0.4 * on); ring(g, 0, 0, R, 4, col); if (lit) glow(g, 0, 0, R * 1.7, gold, 0.25); icons[i](g, 0, 0, R * 0.62, col); g.restore();
    text(g, labels[i], xI + R + 50, y, { size: 58, color: col, font: FONTS.ui, weight: 900, spacing: 3, align: 'left', alpha: clamp(on) });
  });
  FX.dust(g, t, { count: 20, color: '#bfe6f8', a: 0.25 });
} });

// s11 — "quanto investiu e quantos contatos vieram."  card de relatório, barras sem valores
registerShot('s11', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, g0 = info.shot.start;
  const tI = (wordTime('investiu', g0) ?? g0 + 0.3) - g0, tC = (wordTime('contatos', g0) ?? g0 + 1.3) - g0;
  const aIn = ease.out(prog(t, 0, 0.35)), sc = 0.94 + 0.06 * ease.outBack(prog(t, 0, 0.45)) + 0.02 * t / info.dur;
  const cw = 900, ch = 860, cx = (E.W - cw) / 2, cy = (E.H - ch) / 2 - 80;
  g.save(); g.globalAlpha *= aIn; g.translate(E.W / 2, E.H / 2); g.scale(sc, sc); g.translate(-E.W / 2, -E.H / 2);
  rr(g, cx, cy, cw, ch, 32); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 3; g.stroke();
  text(g, 'RELATÓRIO DO MÊS', cx + 70, cy + 100, { size: 50, color: ui.text, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  const row = (y, label, tt, frac) => { const p = ease.inOut(prog(t, tt, tt + 0.9));
    text(g, label, cx + 70, y, { size: 44, color: p > 0 ? ui.cream : alpha(ui.cream, 0.4), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
    rr(g, cx + 70, y + 50, cw - 140, 56, 28); g.fillStyle = alpha(ui.gold, 0.12); g.fill();
    const w = Math.max(56, (cw - 140) * frac * p); rr(g, cx + 70, y + 50, w, 56, 28); g.fillStyle = ui.gold; g.fill(); if (p > 0) glow(g, cx + 70 + w, y + 78, 70, ui.gold, 0.5);
    if (p > 0.95) { ring(g, cx + cw - 90, y, 26, 5, ui.good); seg(g, [[cx + cw - 102, y], [cx + cw - 92, y + 10], [cx + cw - 76, y - 10]], 5, ui.good); } };
  row(cy + 280, 'INVESTIMENTO', tI, 0.62);
  row(cy + 520, 'CONTATOS', tC, 0.78);
  g.restore();
} });
