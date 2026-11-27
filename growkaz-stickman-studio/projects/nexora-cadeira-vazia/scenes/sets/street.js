// sets/street.js — neighbourhood street, late afternoon. Key: low sun behind the buildings.
import { E, V, mood, layer, backdrop, alpha, shade, mix, linGrad } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const streetGround = () => E.H * V(0.8, 0.68);
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = streetGround(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => {
    backdrop(g, M.sky);
    FX.sun(g, CX - V(300, 180), GY - V(560, 760), 60, '#fff6e6', M.key, 5);
    FX.clouds(g, { y: GY - V(900, 1300), h: 260, color: '#eaf4fb', a: 0.12, seed: 4 });
    FX.skyline(g, { x: -E.W, y: GY - V(380, 520), w: E.W * 3, minH: 60, maxH: V(240, 380), color: mix(M.sky[1], M.dark, 0.7), windowColor: alpha(M.practical, 0.5), lit: 0.15, seed: 9 });
  });
  layer(g, cam, 0.5, (g) => {
    const fac = shade(M.wall, -0.2);
    for (const [i, h, c] of [[-3, 520, 0], [-2, 640, 1], [-1, 480, 2], [0, 600, 3], [1, 700, 4], [2, 500, 5], [3, 620, 6]])
      FX.facade(g, { x: CX + i * V(300, 330) - V(140, 155), y: GY, w: V(280, 310), h: V(h, h * 1.2), color: shade(fac, (c % 3) * 0.06), win: M.practical, dark: shade(M.dark, 0.1), cols: 3, rows: 4, lit: 0.35, seed: 20 + c, door: c === 3 });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.road, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    g.fillStyle = shade(M.road, 0.2); g.fillRect(-E.W * 1.5, GY, E.W * 4, 14);
    FX.lampPost(g, CX - V(520, 380), GY, V(360, 420), { color: M.dark, light: M.practical, a: 0.16 });
    FX.lampPost(g, CX + V(460, 330), GY, V(360, 420), { color: M.dark, light: M.practical, a: 0.16 });
    FX.tree(g, CX + V(700, 470), GY, 1.4, shade(M.dark, -0.1));
  });
  return { GY, CX, M };
}
