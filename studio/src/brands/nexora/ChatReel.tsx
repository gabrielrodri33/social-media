import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {Hl, NxBackground} from './ui';

// Reel 1080×1920 (14 s, sem voz): conversa de WhatsApp genérica animada com salto de tempo.
// Linha do tempo fixa para 3 mensagens: chamada (m0) → salto de horas → resposta da clínica (m1) → reação do paciente (m2) → final.
// Áudio: só SFX baixos; a música entra no app, da biblioteca liberada do Instagram.
export type ChatReelMsg = {from: 'in' | 'out'; text: string; time: string};
export type ChatReelProps = {
  hook: string; // antes do salto, ex.: 'O paciente chamou às 9h.'
  after: string; // depois do salto, ex.: 'A clínica respondeu às 15h.'
  afterHighlight?: string;
  contact: string;
  messages: [ChatReelMsg, ChatReelMsg, ChatReelMsg];
  skipLabel: string; // ex.: '6 HORAS DEPOIS'
  finalTitle: string;
  finalHighlight?: string;
  cta: string;
};
export const CHAT_REEL_FRAMES = 420;

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const T = {m0: 40, skipA: 95, skipB: 185, m1: 200, m2: 262, final: 330};
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const fmt = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.floor(min % 60)).padStart(2, '0')}`;

const Typing: React.FC<{out?: boolean}> = ({out}) => {
  const f = useCurrentFrame();
  return (
    <div style={{alignSelf: out ? 'flex-end' : 'flex-start', display: 'flex', gap: 10, padding: '20px 24px', borderRadius: 26, background: out ? `${C.cyan}55` : '#ffffff17'}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 13, height: 13, borderRadius: '50%', background: C.ice, opacity: 0.35 + 0.65 * Math.abs(Math.sin((f - i * 5) / 6))}} />)}
    </div>
  );
};

const Bubble: React.FC<{m: ChatReelMsg; at: number; bad?: boolean}> = ({m, at, bad}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 14, stiffness: 140}});
  const out = m.from === 'out';
  return (
    <div style={{alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: '84%', opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.92 + 0.08 * s})`,
      transformOrigin: out ? 'right bottom' : 'left bottom', padding: '16px 22px 10px', fontFamily: FONT, fontSize: 31, lineHeight: 1.3,
      background: out ? C.cyan : bad ? '#ff6f6133' : '#ffffff17', border: bad ? '2px solid #ff6f61aa' : 'none', color: out ? C.navy : C.ice, fontWeight: out ? 600 : 400,
      borderRadius: out ? '26px 26px 8px 26px' : '26px 26px 26px 8px'}}>
      {m.text}
      <div style={{marginTop: 4, textAlign: 'right', fontSize: 21, fontWeight: 600, opacity: 0.65}}>{m.time}</div>
    </div>
  );
};

export const ChatReel: React.FC<ChatReelProps> = (p) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [m0, m1, m2] = p.messages;
  // relógio do topo: parado em m0, corre durante o salto, para em m1
  const tMin = interpolate(f, [T.skipA, T.skipB], [toMin(m0.time), toMin(m1.time)], {...cl, easing: Easing.inOut(Easing.cubic)});
  const skipping = f > T.skipA && f < T.skipB;
  const showAfter = f >= T.skipB - 10;
  const phoneIn = spring({frame: f - 4, fps, config: {damping: 18}});
  const finalK = interpolate(f, [T.final, T.final + 14], [0, 1], cl);
  const dim = interpolate(f, [T.skipA, T.skipA + 15, T.skipB - 10, T.skipB], [0, 0.55, 0.55, 0], cl);
  const textK = (at: number) => spring({frame: f - at, fps, config: {damping: 16}});
  const headline = showAfter ? p.after : p.hook;
  const hk = showAfter ? textK(T.skipB - 10) : textK(0);
  const shake = f > T.m2 && f < T.m2 + 12 ? Math.sin(f * 2.2) * 6 : 0;
  return (
    <AbsoluteFill>
      <NxBackground animate />
      {/* conversa */}
      <AbsoluteFill style={{opacity: 1 - finalK}}>
        <div style={{position: 'absolute', top: SAFE.story.top, left: SAFE.story.x, right: 170}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, color: skipping ? C.cyan : C.sky, letterSpacing: 2}}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <circle cx="12" cy="12" r="9.5" />
              <path d={`M12 12 L${12 + 5 * Math.sin((tMin / 60) * Math.PI / 6 * 1)} ${12 - 5 * Math.cos((tMin / 60) * Math.PI / 6)}`} />
              <path d={`M12 12 L${12 + 7 * Math.sin(((tMin % 60) / 60) * Math.PI * 2)} ${12 - 7 * Math.cos(((tMin % 60) / 60) * Math.PI * 2)}`} />
            </svg>
            {fmt(tMin)}
          </div>
          <div style={{marginTop: 18, fontFamily: DISPLAY, fontWeight: 700, fontSize: 76, lineHeight: 1.08, letterSpacing: -1.5, color: '#fff',
            opacity: hk, transform: `translateY(${(1 - hk) * 30}px)`}}>
            {showAfter ? <Hl text={headline} highlight={p.afterHighlight} /> : headline}
          </div>
        </div>
        <div style={{position: 'absolute', top: 640, left: (1080 - 170 + 90) / 2 - 290, width: 580, height: 920, borderRadius: 64, background: '#040b18', padding: 18,
          border: `3px solid ${C.sky}55`, boxShadow: `0 40px 110px rgba(0,0,0,.6), 0 0 110px ${C.cyan}22`,
          opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 80 + shake}px)`}}>
          <div style={{height: '100%', borderRadius: 48, background: '#0b1f3a', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '30px 26px 22px', borderBottom: `1px solid ${C.sky}33`, background: '#0e2747'}}>
              <div style={{width: 56, height: 56, borderRadius: '50%', background: `${C.sky}55`}} />
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.ice}}>{p.contact}</div>
            </div>
            <div style={{flex: 1, minHeight: 0, padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 18}}>
              {f >= T.m0 - 22 && f < T.m0 && <Typing />}
              {f >= T.m0 && <Bubble m={m0} at={T.m0} />}
              {f >= T.skipA + 10 && (
                <div style={{alignSelf: 'center', padding: '10px 24px', borderRadius: 999, background: '#ff6f6126', border: '2px solid #ff6f61aa', color: '#ffb3aa',
                  fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 1.5, whiteSpace: 'nowrap', opacity: interpolate(f, [T.skipA + 10, T.skipA + 20], [0, 1], cl)}}>{p.skipLabel}</div>
              )}
              {f >= T.m1 - 18 && f < T.m1 && <Typing out />}
              {f >= T.m1 && <Bubble m={m1} at={T.m1} />}
              {f >= T.m2 - 18 && f < T.m2 && <Typing />}
              {f >= T.m2 && <Bubble m={m2} at={T.m2} bad />}
            </div>
            <AbsoluteFill style={{background: '#02050c', opacity: dim, pointerEvents: 'none'}} />
          </div>
        </div>
      </AbsoluteFill>
      {/* final */}
      {f >= T.final && (
        <AbsoluteFill style={{opacity: finalK, padding: `${SAFE.story.top}px 170px ${SAFE.story.bottom}px ${SAFE.story.x}px`, justifyContent: 'center'}}>
          <NexoraLogo variant="logo" theme="dark" height={110} />
          <div style={{marginTop: 70, fontFamily: DISPLAY, fontWeight: 700, fontSize: 80, lineHeight: 1.1, letterSpacing: -1.5, color: '#fff',
            transform: `translateY(${(1 - textK(T.final + 4)) * 30}px)`}}><Hl text={p.finalTitle} highlight={p.finalHighlight} /></div>
          <div style={{marginTop: 50, fontFamily: FONT, fontWeight: 600, fontSize: 38, color: C.sky, opacity: textK(T.final + 20)}}>{p.cta}</div>
        </AbsoluteFill>
      )}
      {/* SFX baixos (música entra no app) */}
      <Sequence from={T.m0} layout="none"><Audio src={staticFile('assets/nexora/audio/sfx/pop.wav')} volume={0.12} /></Sequence>
      <Sequence from={T.skipA} layout="none"><Audio src={staticFile('assets/nexora/audio/sfx/whoosh.wav')} volume={0.14} /></Sequence>
      <Sequence from={T.m1} layout="none"><Audio src={staticFile('assets/nexora/audio/sfx/pop.wav')} volume={0.12} /></Sequence>
      <Sequence from={T.m2} layout="none"><Audio src={staticFile('assets/nexora/audio/sfx/impact.wav')} volume={0.12} /></Sequence>
      <Sequence from={T.final} layout="none"><Audio src={staticFile('assets/nexora/audio/sfx/swish.wav')} volume={0.12} /></Sequence>
    </AbsoluteFill>
  );
};
