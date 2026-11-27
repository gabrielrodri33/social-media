// sets/clinic.js — dental office on a weekday afternoon. Key light: big window with blinds (left), cool interior.
import { E, V, S, mood, layer, rr, seg, circle, linGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const clinicGround = () => E.H * V(0.8, 0.68);
export const chairX = () => E.W / 2 + V(120, 150);

// dental chair: pedestal + reclined seat/back + headrest + overhead lamp arm. Returns seat top point.
export function dentalChair(g, x, GY, s, M, t = 0, lampOn = true) {
  const body = shade(M.wall, 0.45), up = S().ui.gold, dark = shade(M.dark, -0.2);
  g.save(); g.translate(x, GY); g.scale(s, s);
  rr(g, -90, -14, 180, 14, 7); g.fillStyle = dark; g.fill();                         // base plate
  rr(g, -22, -120, 44, 108, 10); g.fillStyle = body; g.fill();                        // pedestal
  // upholstery as connected capsules: leg rest -> seat -> reclined back -> headrest
  seg(g, [[200, -80], [110, -160]], 44, shade(up, -0.35));
  seg(g, [[110, -160], [-110, -160]], 54, shade(up, -0.25));
  seg(g, [[-110, -160], [-235, -330]], 54, shade(up, -0.15));
  seg(g, [[-235, -330], [-262, -372]], 38, shade(up, 0.0));
  seg(g, [[60, -186], [60, -212], [-20, -212]], 9, body);                             // armrest
  seg(g, [[100, -184], [-100, -184]], 5, alpha('#ffffff', 0.22));                     // rim highlight
  // lamp arm
  seg(g, [[150, -120], [150, -560], [-40, -600], [-170, -520]], 12, body);
  rr(g, -230, -540, 120, 46, 20); g.fillStyle = body; g.fill();
  if (lampOn) { glow(g, -170, -500, 120, M.practical, 0.55); FX.lightCone(g, -170, -500, { angle: Math.PI / 2 + 0.15, spread: 0.6, len: 420, color: M.practical, a: 0.12 }); }
  g.restore();
  return { headX: x - 250 * s, headY: GY - 350 * s };
}

export function clinic(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = clinicGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.15), wallDark = shade(M.wall, -0.5);
  layer(g, cam, 0.35, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [M.dark, wall]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    const wx = CX - V(700, 470), wy = GY - V(620, 1000), ww = V(560, 500), wh = V(400, 600);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: wallDark, bar: 10, blinds: 7 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, mood('golden').sky); g.fillRect(x, y, w, h);
      FX.sun(g, x + w * 0.7, y + h * 0.35, 40, '#fffaf0', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.5, color: alpha(wallDark, 0.85), windowColor: alpha(M.practical, 0.5), lit: 0.2, seed: 12 });
    });
    FX.godRays(g, wx + ww * 0.7, wy + wh * 0.35, { count: 9, angle: 0.55, spread: 0.5, len: V(1400, 1600), a: 0.05, t });
    // wall clock: 15:00 + t
    FX.clock(g, CX + V(520, 330), GY - V(700, 1060), V(52, 62), 15 * 3600 + t * 30, { face: '#eaf4fb' });
    // cabinet + monitor (right)
    FX.counter(g, { x: CX + V(300, 170), y: GY - 10, w: V(700, 520), h: V(150, 170), color: shade(M.wall, -0.4), top: shade(M.wall, 0.1), doors: 5 });
    FX.screen(g, { x: CX + V(560, 340), y: GY - V(330, 360), w: V(150, 150), h: V(96, 100), glowC: M.practical, a: 0.18 }, (g, x, y, w, h) => {
      g.strokeStyle = alpha(M.practical, 0.9); g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 22; i++) g.lineTo(x + 6 + i * 6.4, y + h / 2 - (i % 6 === 0 ? 18 : 3) * Math.sin(i + t * 2)); g.stroke();
    });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 10, 0, GY + 600, [shade(M.floor, 0.15), M.dark]); g.fillRect(-E.W * 1.5, GY - 10, E.W * 4, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.22)', 0.07);
    FX.pool(g, CX - V(200, 120), GY + 40, V(600, 520), 90, M.key, 0.16);
  });
  return { GY, CX, M };
}
