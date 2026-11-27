// shots/04_bairro3d.js — s08: bairro low-poly; a clínica acende em ciano com um feixe de luz. Órbita lenta.
import { E, V, S, registerShot, mood, ease, prog } from '/engine/core.js';

registerShot('s08', {
  kind: '3d',
  init(T) {
    const M = mood('night'), ui = S().ui;
    const st = T.stage({ mood: 'night', fov: V(40, 50), fog: [18, 60], keyPos: [-10, 14, 8], keyIntensity: 2.2, ambient: 1.6 });
    st.add(T.ground(120, 120, M.floor, T.tiles(M.floor, 12, [12, 12])));
    // streets
    for (const x of [-6, 0, 6]) st.add(T.box(1.6, 0.02, 80, M.road, x + 3, 0.01, 0));
    // blocks of buildings (deterministic heights)
    const H = [3, 5, 2.5, 6, 4, 3.5, 7, 2.8, 4.5, 5.5, 3.2, 6.5];
    let k = 0, clinic = null;
    for (let gx = -2; gx <= 2; gx++) for (let gz = -3; gz <= 1; gz++) {
      const x = gx * 6, z = gz * 6, h = H[(k++) % H.length];
      if (gx === 0 && gz === -1) { clinic = { x, z, h: 3.2 }; continue; }
      const b = T.building(3.6, h, 3.6, { color: M.wall, win: M.practical, lit: 0.35, seed: 10 + k }); b.position.x = x; b.position.z = z; st.add(b);
    }
    // the clinic: low building that lights up cyan
    const cb = T.building(3.6, clinic.h, 3.6, { color: '#1a3a5e', win: '#bff4ff', lit: 0.8, seed: 3 }); cb.position.set(clinic.x, clinic.h / 2, clinic.z); st.add(cb);
    const roof = T.box(3.8, 0.12, 3.8, T.basic(ui.gold), clinic.x, clinic.h + 0.06, clinic.z); st.add(roof);
    const beams = []; for (const r of [0, Math.PI / 2]) { const s = T.shaft(2.2, 30, ui.gold, 0.0); s.position.set(clinic.x, clinic.h + 15, clinic.z); s.rotation.y = r; st.add(s); beams.push(s); }
    const pin = T.sphere(0.45, T.basic(ui.gold), clinic.x, clinic.h + 2.2, clinic.z); st.add(pin);
    const pinTip = T.cone(0.36, 0.9, T.basic(ui.gold), clinic.x, clinic.h + 1.55, clinic.z); pinTip.rotation.x = Math.PI; st.add(pinTip);
    st.add(T.tree3D(-3, 4, 0.8, '#0c1a2c'), T.tree3D(9, -4, 0.9, '#0c1a2c'), T.tree3D(-9, -10, 0.8, '#0c1a2c'));
    return { stage: st, beams, pin, pinTip, roof, clinic };
  },
  draw(s, t, info, T) {
    const on = ease.out(prog(t, 0.9, 1.6));
    s.beams.forEach(b => { b.material.opacity = 0.22 * on; });
    const bob = Math.sin(t * 3) * 0.12, up = 3 * (1 - ease.outBack(prog(t, 1.0, 1.6)));
    s.pin.visible = s.pinTip.visible = t > 1.0;
    s.pin.position.y = s.clinic.h + 2.2 + bob + up; s.pinTip.position.y = s.clinic.h + 1.55 + bob + up;
    s.roof.material.color.setScalar(0.2 + 0.8 * on); s.roof.material.color.lerp(new T.THREE.Color(S().ui.gold), on);
    T.orbit(s.stage.camera, t, { target: [s.clinic.x, 1.5, s.clinic.z], radius: [V(30, 34), V(24, 27)], height: [24, 18], from: -0.7, to: -0.2, dur: info.dur });
  },
});
