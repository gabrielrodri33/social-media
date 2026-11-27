import React from 'react';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {WhatsAppIcon} from './ui';

// Comercial curto de oferta (reel 1080×1920, 12 s). Estética: preto profundo, azul elétrico, vidro, brilho e partículas.
// Regra do logo: o NexoraLogo aparece sempre plano e intacto; luz, reflexo e brilho ficam no AMBIENTE, nunca no logo.

export type PromoProps = {
  seal: [string, string]; // ex.: ['BLACK FRIDAY', '80% OFF']
  priceFrom: string; // ex.: 'R$ 2.500' (precisa ser preço real já praticado)
  priceTo: string; // ex.: 'R$ 500'
  offer: string; // ex.: 'CONFIGURAÇÃO DO TRÁFEGO PAGO + CALENDÁRIO EDITORIAL'
  delivery: string; // ex.: 'ENTREGA EM 1 DIA ÚTIL'
  cta: string; // ex.: 'FALE COM A NEXORA'
  musicSrc?: string;
};

export const BLACK = '#02050c';
export const ELECTRIC = '#1f8bff';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// ---------- ambiente ----------
export const Room: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
      {/* feixe volumétrico vindo de cima */}
      <div style={{position: 'absolute', left: '50%', top: -200, width: 1400, height: 1700, transform: 'translateX(-50%)',
        background: `conic-gradient(from 180deg at 50% 0%, transparent 160deg, ${ELECTRIC}40 172deg, ${C.cyan}66 180deg, ${ELECTRIC}40 188deg, transparent 200deg)`,
        filter: 'blur(30px)', opacity: 0.9 * intensity}} />
      {/* névoa */}
      <div style={{position: 'absolute', left: -300, bottom: -300, width: 1700, height: 900, borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${ELECTRIC}26 0%, transparent 65%)`, transform: `translateX(${Math.sin(f / 50) * 40}px)`}} />
      {/* piso reflexivo */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520,
        background: `linear-gradient(180deg, transparent, ${ELECTRIC}12 60%, ${ELECTRIC}20)`}} />
      <div style={{position: 'absolute', left: -100, right: -100, bottom: 520, height: 2, background: `linear-gradient(90deg, transparent, ${C.cyan}55, transparent)`}} />
      <Particles />
      {/* vinheta */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Particles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(40).fill(0).map((_, i) => {
        const x = random(`px${i}`) * 1080;
        const speed = 0.4 + random(`ps${i}`) * 1.2;
        const y = (random(`py${i}`) * 1920 - f * speed * 2 + 1920 * 2) % 1920;
        const s = 2 + random(`pz${i}`) * 4;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%',
          background: C.cyan, opacity: 0.25 + random(`po${i}`) * 0.5, boxShadow: `0 0 ${s * 3}px ${C.cyan}`}} />;
      })}
    </>
  );
};

// ---------- cena 1: linha de luz revela o logo ----------
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = interpolate(f, [4, 34], [-0.1, 1.1], {...cl, easing: ease});
  const lineX = sweep * 1080;
  const logoClip = interpolate(f, [8, 38], [0, 100], {...cl, easing: ease});
  const out = interpolate(f, [56, 66], [1, 0], cl);
  return (
    <AbsoluteFill style={{opacity: out}}>
      {/* linha horizontal que atravessa a sala */}
      <div style={{position: 'absolute', top: 958, left: 0, width: lineX, height: 4, background: `linear-gradient(90deg, transparent, ${C.cyan})`,
        boxShadow: `0 0 30px ${C.cyan}, 0 0 80px ${ELECTRIC}`}} />
      <div style={{position: 'absolute', top: 900, left: lineX - 60, width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, #fff 0%, ${C.cyan} 25%, transparent 70%)`, opacity: sweep < 1 ? 1 : 0}} />
      {/* brilho atrás do logo (no ambiente) */}
      <div style={{position: 'absolute', left: '50%', top: 960, width: 900, height: 500, transform: 'translate(-50%, -50%)',
        background: `radial-gradient(ellipse, ${ELECTRIC}55 0%, transparent 65%)`, opacity: logoClip / 100}} />
      {/* logo oficial, plano, revelado por máscara da esquerda para a direita */}
      <div style={{position: 'absolute', left: '50%', top: 960, transform: 'translate(-50%, -50%)', clipPath: `inset(0 ${100 - logoClip}% 0 0)`}}>
        <NexoraLogo variant="logo" theme="dark" height={300} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- cena 2: painel de anúncios + calendário ----------
const Glass: React.FC<{children: React.ReactNode; w: number; h: number}> = ({children, w, h}) => (
  <div style={{width: w, height: h, borderRadius: 28, padding: 28, boxSizing: 'border-box',
    background: 'linear-gradient(145deg, rgba(40,110,255,0.22), rgba(5,15,35,0.85) 55%)',
    border: '2px solid rgba(120,200,255,0.55)',
    boxShadow: `0 0 0 1px rgba(255,255,255,0.06) inset, 0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${ELECTRIC}55`,
    position: 'relative', overflow: 'hidden'}}>
    {/* reflexo metálico */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.14) 45%, transparent 55%)'}} />
    {children}
  </div>
);

export const AdsPanel: React.FC = () => {
  const f = useCurrentFrame();
  const bars = [0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.75];
  return (
    <Glass w={430} h={520}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: 2}}>ANÚNCIOS</div>
      <div style={{fontFamily: FONT, fontSize: 22, color: '#9cc9ff', marginTop: 6}}>Google · Meta</div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 280, marginTop: 50}}>
        {bars.map((b, i) => {
          const g = interpolate(f, [6 + i * 3, 26 + i * 3], [0, b], {...cl, easing: ease});
          return <div key={i} style={{flex: 1, height: `${g * 100}%`, borderRadius: 8,
            background: `linear-gradient(180deg, ${C.cyan}, ${ELECTRIC})`, boxShadow: `0 0 18px ${C.cyan}88`}} />;
        })}
      </div>
      <div style={{height: 3, background: 'rgba(160,210,255,0.4)', marginTop: 10}} />
    </Glass>
  );
};

export const CalendarPanel: React.FC = () => {
  const f = useCurrentFrame();
  const days = new Array(20).fill(0);
  return (
    <Glass w={430} h={520}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: 2}}>CALENDÁRIO</div>
      <div style={{fontFamily: FONT, fontSize: 22, color: '#9cc9ff', marginTop: 6}}>Instagram</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 40}}>
        {days.map((_, i) => {
          const on = [1, 3, 6, 8, 10, 12, 15, 17, 19].includes(i);
          const a = interpolate(f, [8 + i * 1.2, 16 + i * 1.2], [0, 1], cl);
          return <div key={i} style={{height: 62, borderRadius: 10, opacity: a,
            background: on ? `linear-gradient(135deg, ${C.cyan}, ${ELECTRIC})` : 'rgba(120,170,255,0.15)',
            boxShadow: on ? `0 0 16px ${C.cyan}77` : 'none', border: '1px solid rgba(150,200,255,0.25)'}} />;
        })}
      </div>
    </Glass>
  );
};

const Objects: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inL = spring({frame: f, fps, config: {damping: 18}});
  const inR = spring({frame: f - 6, fps, config: {damping: 18}});
  // cena 3 (a partir do frame 60 desta sequência): os dois se juntam no centro
  const merge = interpolate(f, [60, 80], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const float = (k: number) => Math.sin((f + k) / 14) * 14;
  const out = interpolate(f, [80, 84], [1, 0], cl);
  return (
    <AbsoluteFill style={{perspective: 1600, opacity: out}}>
      <div style={{position: 'absolute', left: interpolate(merge, [0, 1], [70, 325]), top: 700 + float(0),
        transform: `translateX(${(1 - inL) * -700}px) rotateY(${interpolate(merge, [0, 1], [24, 0])}deg) scale(${1 - merge * 0.35})`, opacity: inL}}>
        <AdsPanel />
      </div>
      <div style={{position: 'absolute', left: interpolate(merge, [0, 1], [580, 325]), top: 760 + float(20),
        transform: `translateX(${(1 - inR) * 700}px) rotateY(${interpolate(merge, [0, 1], [-24, 0])}deg) scale(${1 - merge * 0.35})`, opacity: inR}}>
        <CalendarPanel />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 46,
        color: '#fff', letterSpacing: 1, opacity: interpolate(f, [18, 30], [0, 1], cl) * (1 - merge)}}>
        Tráfego pago <span style={{color: C.cyan}}>+</span> conteúdo
      </div>
    </AbsoluteFill>
  );
};

// explosão de luz azul (cena 3)
export const Burst: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 4, 22], [0, 1, 0], cl);
  const r = interpolate(f, [0, 22], [0.2, 2.4], {...cl, easing: ease});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1200, height: 1200, transform: `translate(-50%, -50%) scale(${r})`,
        background: `radial-gradient(circle, #ffffff 0%, ${C.cyan} 18%, ${ELECTRIC}aa 35%, transparent 62%)`, opacity: a}} />
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 2200, height: 2200, transform: `translate(-50%, -50%) rotate(${f * 2}deg)`,
        background: `repeating-conic-gradient(from 0deg, ${C.cyan}55 0deg 3deg, transparent 3deg 15deg)`, opacity: a * 0.8,
        maskImage: 'radial-gradient(circle, black 0%, transparent 55%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 55%)'}} />
      <AbsoluteFill style={{background: '#cfefff', opacity: interpolate(f, [0, 3, 8], [0, 0.55, 0], cl)}} />
    </AbsoluteFill>
  );
};

// ---------- cena 4: selo ----------
export const Seal: React.FC<{lines: [string, string]; dur?: number}> = ({lines, dur = 52}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 11, mass: 0.9}});
  const rot = interpolate(f, [0, 24], [-90, 0], {...cl, easing: ease});
  const shine = interpolate(f, [16, 40], [-120, 220], cl);
  const out = interpolate(f, [dur - 6, dur], [1, 0], cl);
  return (
    <AbsoluteFill style={{perspective: 1400, justifyContent: 'center', alignItems: 'center', opacity: out}}>
      <div style={{width: 760, height: 760, borderRadius: '50%', transform: `scale(${0.4 + s * 0.6}) rotateY(${rot}deg)`,
        background: 'conic-gradient(from 210deg, #9fb3c8, #f4f8ff, #5d6f86, #e6eef8, #8094ab, #f4f8ff, #9fb3c8)', padding: 18, boxSizing: 'border-box',
        boxShadow: `0 0 120px ${ELECTRIC}aa, 0 40px 90px rgba(0,0,0,0.7)`}}>
        <div style={{width: '100%', height: '100%', borderRadius: '50%', position: 'relative', overflow: 'hidden',
          background: `radial-gradient(circle at 35% 30%, #12305e, ${BLACK} 70%)`, border: `4px solid ${C.cyan}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, letterSpacing: 4, color: '#fff', lineHeight: 1}}>{lines[0].split(' ')[0]}</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, letterSpacing: 4, color: '#fff', lineHeight: 1.05}}>{lines[0].split(' ').slice(1).join(' ')}</div>
          <div style={{width: 420, height: 4, background: C.cyan, margin: '26px 0', boxShadow: `0 0 20px ${C.cyan}`}} />
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 132, color: C.cyan, lineHeight: 1, textShadow: `0 0 40px ${ELECTRIC}`}}>{lines[1]}</div>
          <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: `${shine}%`, transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cena 5: preço ----------
export const Price: React.FC<{from: string; to: string; dur?: number}> = ({from, to, dur = 76}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = interpolate(f, [0, 6], [0, 1], cl);
  const strike = interpolate(f, [6, 16], [0, 100], {...cl, easing: ease});
  const big = spring({frame: f - 14, fps, config: {damping: 10}});
  const out = interpolate(f, [dur - 6, dur], [1, 0], cl);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out}}>
      <div style={{position: 'relative', fontFamily: DISPLAY, fontWeight: 800, fontSize: 110, color: '#8ea6c4', opacity: a}}>
        <span style={{fontSize: 46, verticalAlign: 'middle', marginRight: 16}}>DE</span>{from}
        <div style={{position: 'absolute', left: 0, top: '54%', height: 10, width: `${strike}%`, background: '#ff3b5c', borderRadius: 5,
          boxShadow: '0 0 20px #ff3b5c', transform: 'rotate(-6deg)'}} />
      </div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 700, fontSize: 46, color: '#fff', letterSpacing: 6, opacity: big}}>POR</div>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 196, lineHeight: 1, color: C.cyan, whiteSpace: 'nowrap', transform: `scale(${big})`,
        textShadow: `0 0 60px ${ELECTRIC}, 0 0 120px ${ELECTRIC}88`}}>{to}</div>
    </AbsoluteFill>
  );
};

// ---------- cena final ----------
const Final: React.FC<{offer: string; delivery: string; cta: string}> = ({offer, delivery, cta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l1 = spring({frame: f, fps, config: {damping: 16}});
  const l2 = spring({frame: f - 8, fps, config: {damping: 16}});
  const b = spring({frame: f - 16, fps, config: {damping: 11}});
  const pulse = 1 + Math.sin(f / 4) * 0.025 * Math.min(1, Math.max(0, f - 24) / 10);
  return (
    <AbsoluteFill style={{padding: `${SAFE.story.top}px 110px ${SAFE.story.bottom}px`, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <NexoraLogo variant="logo" theme="dark" height={130} />
      <div style={{marginTop: 70, fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, lineHeight: 1.12, color: '#fff', letterSpacing: 0.5,
        opacity: l1, transform: `translateY(${(1 - l1) * 40}px)`}}>{offer}</div>
      <div style={{marginTop: 34, padding: '14px 34px', borderRadius: 999, border: `3px solid ${C.cyan}`, fontFamily: FONT, fontWeight: 700,
        fontSize: 40, color: C.cyan, letterSpacing: 3, opacity: l2, boxShadow: `0 0 30px ${ELECTRIC}66`}}>{delivery}</div>
      <div style={{marginTop: 60, display: 'flex', alignItems: 'center', gap: 20, padding: '34px 60px', borderRadius: 999,
        background: `linear-gradient(135deg, ${C.cyan}, ${ELECTRIC})`, color: BLACK, fontFamily: DISPLAY, fontWeight: 900, fontSize: 46,
        boxShadow: `0 0 70px ${ELECTRIC}, 0 20px 50px rgba(0,0,0,0.5)`, transform: `scale(${b * pulse})`}}>
        <WhatsAppIcon size={52} color={BLACK} />
        {cta}
      </div>
    </AbsoluteFill>
  );
};

// ---------- montagem: 12 s ----------
// 0–66 revelação · 60–144 objetos (fusão em 120–144) · 138–164 explosão · 150–202 selo · 198–274 preço (R$ 500 ~2 s) · 270–360 final
export const PROMO_FRAMES = 360;
export const Promo: React.FC<PromoProps> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room intensity={interpolate(f, [0, 20], [0.3, 1], cl)} />
      <Sequence from={0} durationInFrames={66}><Reveal /></Sequence>
      <Sequence from={60} durationInFrames={84}><Objects /></Sequence>
      <Sequence from={138} durationInFrames={26}><Burst /></Sequence>
      <Sequence from={150} durationInFrames={52}><Seal lines={p.seal} /></Sequence>
      <Sequence from={198} durationInFrames={76}><Price from={p.priceFrom} to={p.priceTo} /></Sequence>
      <Sequence from={270}><Final offer={p.offer} delivery={p.delivery} cta={p.cta} /></Sequence>
      {p.musicSrc && <Audio src={staticFile(p.musicSrc)} volume={0.9} />}
    </AbsoluteFill>
  );
};
