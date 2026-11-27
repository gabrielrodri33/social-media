import React, {useMemo} from 'react';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {AbsoluteFill, Audio, CalculateMetadataFunction, Easing, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, NexoraLogo} from './brand';
import {WhatsAppIcon} from './ui';
import {BLACK, ELECTRIC, Particles, Room} from './Promo';
import {Env, font} from './Seal3D';

// Comercial 12 s "preço riscado" (reel 1080×1920): feixe de luz + título, "R$ 2.500" em 3D cortado por laser,
// explosão de luz que vira "R$ 500" + "80% OFF", final com logo (plano, intacto) + serviços + entrega + CTA.
// Cenas seguem o voice-timings.json (4 falas = 4 cenas). O logo NUNCA entra no 3D.

export type Strike3DProps = {
  title: [string, string]; // ['ATENÇÃO,', 'CLÍNICAS ODONTOLÓGICAS']
  priceFrom: string; // precisa ser preço real já praticado
  priceTo: string;
  off: string;
  services: [string, string];
  delivery: string;
  cta: string;
  audioSrc?: string;
  timings?: number[];
  audioDuration?: number;
  musicSrc?: string;
};

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const LEAD = 12; // 0,4 s de feixe antes da voz
const TAIL = 24;

const marks = (p: Strike3DProps, fps: number) => {
  const t = p.timings && p.timings.length === 4 ? p.timings : [0, 1.75, 3.16, 5.26];
  const dur = p.audioDuration ?? 11.2;
  const fr = (s: number) => LEAD + Math.round(s * fps);
  const l4 = dur - t[3];
  return {T1: fr(t[1]), T2: fr(t[2]), T3: fr(t[3]), TE: fr(t[3] + l4 * 0.6), TF: fr(t[3] + l4 * 0.8), END: fr(dur) + TAIL};
};
export const calculateStrikeMetadata: CalculateMetadataFunction<Strike3DProps> = ({props}) => ({durationInFrames: marks(props, 30).END});

// ---------- 3D ----------
const useText = (text: string, size: number) => useMemo(() => {
  const g = new TextGeometry(text, {font, size, depth: size * 0.22, curveSegments: 8, bevelEnabled: true, bevelThickness: size * 0.04, bevelSize: size * 0.025, bevelSegments: 4});
  g.computeBoundingBox(); const b = g.boundingBox!; g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
  return g;
}, [text, size]);

const Burst: React.FC<{p: number}> = ({p}) => {
  const N = 420;
  const dirs = useMemo(() => new Array(N).fill(0).map((_, i) => {
    const u = random(`bu${i}`) * 2 - 1, a = random(`ba${i}`) * Math.PI * 2, r = Math.sqrt(1 - u * u), sp = 0.4 + random(`bs${i}`);
    return [r * Math.cos(a) * sp, u * sp, r * Math.sin(a) * sp * 0.6];
  }), []);
  const pos = useMemo(() => new Float32Array(N * 3), []);
  const d = 7 * ease(Math.min(1, p));
  dirs.forEach(([x, y, z], i) => { pos[i * 3] = x * d; pos[i * 3 + 1] = y * d; pos[i * 3 + 2] = z * d; });
  if (p <= 0 || p >= 1) return null;
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} count={N} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial color={'#bff4ff'} size={0.12} transparent opacity={1 - p} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

const PriceScene: React.FC<{p: Strike3DProps; T1: number; T2: number; from: number}> = ({p, T1, T2, from}) => {
  const lf = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = lf + from; // frame global
  const oldGeo = useText(p.priceFrom, 0.78);
  const newGeo = useText(p.priceTo, 0.98);
  // R$ 2.500: entra girando, laser corta, explode
  const enter = interpolate(g, [T1, T1 + 16], [0, 1], {...cl, easing: ease});
  const strikeA = T2 - 18, strikeB = T2 - 11;
  const strike = interpolate(g, [strikeA, strikeB], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const boom = interpolate(g, [T2, T2 + 9], [0, 1], cl);
  const oldOpacity = 1 - boom;
  const oldScale = 1 + boom * 0.7;
  // R$ 500
  const s500 = spring({frame: g - (T2 + 4), fps, config: {damping: 11, stiffness: 120}});
  const burstP = interpolate(g, [T2, T2 + 28], [0, 1], cl);
  const laserTip = -3.6 + 7.2 * strike;
  return (
    <>
      <Env />
      <ambientLight intensity={0.2} />
      <directionalLight position={[-4, 6, 8]} intensity={2.2} />
      <directionalLight position={[5, -2, 6]} intensity={0.9} color={C.sky} />
      <pointLight position={[0, 0, -3]} intensity={90} distance={12} color={ELECTRIC} />
      {strike > 0 && strike < 1 && <pointLight position={[laserTip, 0, 2]} intensity={60} distance={6} color={C.cyan} />}
      {oldOpacity > 0 && (
        <group position={[0, 0.5 + Math.sin(g / 20) * 0.05, interpolate(enter, [0, 1], [-7, 0])]} rotation={[0.12, interpolate(enter, [0, 1], [-1.2, 0]) + Math.sin(g / 26) * 0.12, 0]} scale={oldScale}>
          <mesh geometry={oldGeo}>
            <meshStandardMaterial color={strike >= 1 ? '#8c9ab0' : '#eef4fb'} metalness={0.75} roughness={0.22} emissive={'#6a86aa'} emissiveIntensity={strike >= 1 ? 0.12 : 0.32} transparent opacity={oldOpacity} />
          </mesh>
          {/* laser: corta da esquerda para a direita e fica como risco */}
          {strike > 0 && (
            <group rotation={[0, 0, 0.16]} position={[0, 0, 0.45]}>
              <mesh position={[-3.6 * (1 - strike), 0, 0]} scale={[strike, 1, 1]}>
                <boxGeometry args={[7.2, 0.07, 0.07]} />
                <meshBasicMaterial color={'#e6fbff'} transparent opacity={oldOpacity} />
              </mesh>
              <mesh position={[-3.6 * (1 - strike), 0, 0]} scale={[strike, 1, 1]}>
                <boxGeometry args={[7.2, 0.32, 0.05]} />
                <meshBasicMaterial color={C.cyan} transparent opacity={0.45 * oldOpacity} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
            </group>
          )}
        </group>
      )}
      <Burst p={burstP} />
      {g >= T2 + 4 && (
        <group position={[0, 0.5 + Math.sin(g / 22) * 0.06, 0]} rotation={[0.1, interpolate(s500, [0, 1], [0.9, 0]) + Math.sin(g / 30) * 0.1, 0]} scale={0.2 + 0.8 * s500}>
          <mesh geometry={newGeo}>
            <meshStandardMaterial color={C.cyan} metalness={0.6} roughness={0.18} emissive={C.cyan} emissiveIntensity={0.7} />
          </mesh>
        </group>
      )}
    </>
  );
};

// ---------- HTML ----------
const Flash: React.FC<{at: number; dur?: number}> = ({at, dur = 10}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at - 2, at, at + dur], [0, 1, 0], cl);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, #ffffff ${o * 30}%, ${ELECTRIC} ${o * 60}%, transparent 90%)`, opacity: o * 0.9, mixBlendMode: 'screen'}} />;
};

const TitleScene: React.FC<{title: [string, string]; T1: number}> = ({title, T1}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [2, 30], [-150, 1230], {...cl, easing: Easing.inOut(Easing.cubic)});
  const out = interpolate(f, [T1 - 6, T1], [1, 0], cl);
  const words = title[1].split(' ');
  return (
    <AbsoluteFill style={{opacity: out}}>
      {/* feixe atravessando */}
      <div style={{position: 'absolute', top: 960, left: 0, width: 1080, height: 4, background: `linear-gradient(90deg, transparent, ${C.cyan} ${Math.max(0, x / 10.8 - 30)}%, #ffffff ${Math.min(100, x / 10.8)}%, transparent ${Math.min(100, x / 10.8 + 2)}%)`, boxShadow: `0 0 30px ${ELECTRIC}`, opacity: interpolate(f, [26, 40], [1, 0.25], cl)}} />
      <div style={{position: 'absolute', top: 960 - 90, left: x - 90, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #ffffff 0%, rgba(31,139,255,.6) 25%, transparent 65%)', opacity: interpolate(f, [26, 34], [1, 0], cl)}} />
      <div style={{position: 'absolute', top: 960 - 1, left: x - 600, width: 1200, height: 2, background: 'linear-gradient(90deg, transparent, #fff, transparent)', opacity: interpolate(f, [26, 34], [0.9, 0], cl)}} />
      {/* texto revelado pelo feixe */}
      <div style={{position: 'absolute', top: 640, left: SAFE.story.x, right: SAFE.story.x, textAlign: 'center', clipPath: `inset(0 ${Math.max(0, 1080 - x - SAFE.story.x)}px 0 0)`,
        transform: `scale(${interpolate(f, [0, T1], [1, 1.06], cl)})`, fontFamily: DISPLAY}}>
        <div style={{fontSize: 60, fontWeight: 800, letterSpacing: 16, color: C.cyan, textShadow: `0 0 30px ${ELECTRIC}`}}>{title[0]}</div>
        <div style={{height: 220}} />
        {words.map((w, i) => (
          <div key={i} style={{fontSize: w.length > 10 ? 86 : 104, fontWeight: 900, lineHeight: 1.05, color: '#fff', textShadow: `0 0 40px ${ELECTRIC}aa`}}>{w}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const PriceLabels: React.FC<{p: Strike3DProps; T1: number; T2: number; T3: number}> = ({p, T1, T2, T3}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const de = interpolate(f, [T1 + 4, T1 + 12, T2 - 2, T2 + 4], [0, 1, 1, 0], cl);
  const por = interpolate(f, [T2 + 6, T2 + 14], [0, 1], cl);
  const offS = spring({frame: f - (T2 + 16), fps, config: {damping: 12}});
  const out = interpolate(f, [T3 - 5, T3], [1, 0], cl);
  const lab = {position: 'absolute' as const, top: 640, left: 0, right: 0, textAlign: 'center' as const, fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, letterSpacing: 10, color: C.ice};
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{...lab, opacity: de}}>DE</div>
      <div style={{...lab, opacity: por, color: C.cyan}}>POR APENAS</div>
      <div style={{position: 'absolute', top: 1230, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: offS, transform: `scale(${0.6 + 0.4 * offS})`}}>
        <div style={{padding: '18px 60px', borderRadius: 26, background: `linear-gradient(135deg, ${ELECTRIC}, ${C.cyan})`, boxShadow: `0 0 70px ${ELECTRIC}aa`,
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 112, color: '#fff', letterSpacing: 4}}>{p.off}</div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC<{p: Strike3DProps; T3: number; TE: number; TF: number}> = ({p, T3, TE, TF}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = (at: number) => spring({frame: f - at, fps, config: {damping: 16}});
  const logo = interpolate(f, [T3 + 2, T3 + 14], [0, 1], cl);
  const s1 = a(T3 + 10), s2 = a(T3 + 20), s3 = a(T3 + 30), se = a(TE), sf = a(TF);
  const pulse = 1 + 0.03 * Math.sin((f - TF) / 4) * (f > TF + 10 ? 1 : 0);
  const line = (s: number) => ({opacity: s, transform: `translateY(${(1 - s) * 40}px)`});
  return (
    <AbsoluteFill>
      <Room intensity={0.8} />
      <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logo}}>
        <NexoraLogo variant="logo" theme="dark" height={170} />
      </div>
      <div style={{position: 'absolute', top: 580, left: SAFE.story.x, right: 170, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 900, color: '#fff'}}>
        <div style={{...line(s1), fontSize: 62, lineHeight: 1.1}}>{p.services[0]}</div>
        <div style={{...line(s2), fontSize: 90, color: C.cyan, lineHeight: 1.2, textShadow: `0 0 30px ${ELECTRIC}`}}>+</div>
        <div style={{...line(s3), fontSize: 62, lineHeight: 1.1}}>{p.services[1]}</div>
      </div>
      <div style={{position: 'absolute', top: 1120, left: SAFE.story.x, right: 170, display: 'flex', justifyContent: 'center', ...line(se)}}>
        <div style={{borderTop: `2px solid ${C.cyan}88`, borderBottom: `2px solid ${C.cyan}88`, padding: '14px 10px', fontFamily: DISPLAY, fontWeight: 800, fontSize: 50, letterSpacing: 4, color: C.cyan}}>{p.delivery}</div>
      </div>
      <div style={{position: 'absolute', top: 1270, left: SAFE.story.x, right: 170, display: 'flex', justifyContent: 'center', opacity: sf, transform: `scale(${(0.7 + 0.3 * sf) * pulse})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '26px 56px', borderRadius: 999, background: `linear-gradient(135deg, ${ELECTRIC}, ${C.cyan})`, boxShadow: `0 0 60px ${ELECTRIC}aa`,
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 66, color: '#fff'}}>
          <WhatsAppIcon size={66} color="#fff" />{p.cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const sfx = (name: string) => staticFile(`assets/nexora/audio/sfx/${name}.wav`);

export const Strike3D: React.FC<Strike3DProps> = (p) => {
  const f = useCurrentFrame();
  const {width, height, fps, durationInFrames} = useVideoConfig();
  const {T1, T2, T3, TE, TF} = marks(p, fps);
  const from3d = T1 - 4, to3d = T3 + 2;
  const glow = interpolate(f, [T1, T1 + 15, T3 - 4, T3], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{background: BLACK}}>
      {f < T3 + 2 && (
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.navy2} 0%, ${BLACK} 70%)`}}>
          <Particles />
          <div style={{position: 'absolute', left: '50%', top: '45%', width: 1300, height: 1300, transform: 'translate(-50%, -50%)', opacity: glow,
            background: 'radial-gradient(circle, rgba(31,139,255,0.4) 0%, rgba(0,200,232,0.1) 40%, transparent 68%)'}} />
        </AbsoluteFill>
      )}
      {f < T1 && <TitleScene title={p.title} T1={T1} />}
      <Sequence from={from3d} durationInFrames={to3d - from3d} layout="none">
        <AbsoluteFill>
          <ThreeCanvas width={width} height={height} camera={{fov: 32, position: [0, 0, 19]}} gl={{alpha: true, antialias: true}}>
            <PriceScene p={p} T1={T1} T2={T2} from={from3d} />
          </ThreeCanvas>
        </AbsoluteFill>
      </Sequence>
      {f >= T1 && f < T3 && <PriceLabels p={p} T1={T1} T2={T2} T3={T3} />}
      {f >= T3 && <FinalScene p={p} T3={T3} TE={TE} TF={TF} />}
      <Flash at={T1} />
      <Flash at={T2} dur={14} />
      <Flash at={T3} dur={8} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none'}} />
      {/* áudio */}
      {p.audioSrc && <Sequence from={LEAD} layout="none"><Audio src={staticFile(p.audioSrc)} /></Sequence>}
      {p.musicSrc && <Audio src={staticFile(p.musicSrc)} volume={(fr) => {
        // ducking: trilha baixa enquanto a voz fala, um pouco mais alta só antes e depois dela
        const vEnd = LEAD + Math.round((p.audioDuration ?? 11.2) * fps);
        const bed = interpolate(fr, [0, LEAD - 4, LEAD + 4, vEnd - 4, vEnd + 6], [0.12, 0.12, 0.05, 0.05, 0.12], cl);
        return bed * interpolate(fr, [0, 8, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], cl);
      }} />}
      <Sequence from={0} layout="none"><Audio src={sfx('whoosh')} volume={0.5} /></Sequence>
      <Sequence from={T2 - 18 - 30} layout="none"><Audio src={sfx('riser')} volume={0.25} /></Sequence>
      <Sequence from={T2 - 18} layout="none"><Audio src={sfx('impact')} volume={0.45} /></Sequence>
      <Sequence from={T2} layout="none"><Audio src={sfx('flash')} volume={0.5} /></Sequence>
      <Sequence from={T2 + 4} layout="none"><Audio src={sfx('shimmer')} volume={0.3} /></Sequence>
      <Sequence from={T3 - 6} layout="none"><Audio src={sfx('swish')} volume={0.45} /></Sequence>
      <Sequence from={TE} layout="none"><Audio src={sfx('pop')} volume={0.35} /></Sequence>
      <Sequence from={TF} layout="none"><Audio src={sfx('ding')} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
