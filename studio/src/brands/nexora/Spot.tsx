import React from 'react';
import {AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {PhotoBg} from './PhotoBg';
import {AdsPanel, BLACK, CalendarPanel, ELECTRIC, Price, Room, Seal} from './Promo';
import {WhatsAppIcon} from './ui';

// Spot narrado (reel 1080×1920): locução + legenda grande + cortes por cena, sincronizados pelo voice-timings.json.
// Cada cena = uma linha do voice.txt. kind decide o visual.
export type SpotScene =
  | {kind: 'photo'; caption: string; highlight?: string; photo: string; focus?: string}
  | {kind: 'panels'; caption: string; highlight?: string}
  | {kind: 'price'; caption?: string; from: string; to: string}
  | {kind: 'seal'; caption?: string; lines: [string, string]}
  | {kind: 'final'; lines: string[]; cta: string};

export type SpotProps = {
  scenes: SpotScene[];
  audioSrc?: string;
  timings?: number[];
  audioDuration?: number;
  musicSrc?: string;
};

const TAIL = 2.2; // segura a cena final ~3 s depois do "Chame agora!"
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const spotFrames = (p: SpotProps): number[] => {
  if (p.timings && p.audioDuration && p.timings.length === p.scenes.length) {
    const ends = [...p.timings.slice(1), p.audioDuration + TAIL];
    return p.timings.map((t, i) => Math.max(1, Math.round((ends[i] - t) * FPS)));
  }
  return p.scenes.map((s) => Math.round((s.kind === 'final' ? 3.5 : 2.6) * FPS));
};
export const calculateSpotMetadata: CalculateMetadataFunction<SpotProps> = ({props}) => ({
  durationInFrames: spotFrames(props).reduce((a, b) => a + b, 0),
});

// Legenda grande, palavra destacada em ciano, faixa inferior (acima da UI do Instagram).
const Caption: React.FC<{text: string; highlight?: string}> = ({text, highlight}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 16}});
  const parts = highlight && text.includes(highlight) ? text.split(highlight) : [text];
  return (
    <div style={{position: 'absolute', left: SAFE.story.x, right: 170, bottom: SAFE.story.bottom + 30, fontFamily: DISPLAY, fontWeight: 900,
      fontSize: text.length > 60 ? 62 : 76, lineHeight: 1.12, color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.8)',
      opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
      {parts.length === 2 ? <>{parts[0]}<span style={{color: C.cyan}}>{highlight}</span>{parts[1]}</> : text}
    </div>
  );
};

const PanelsScene: React.FC<{caption: string; highlight?: string}> = ({caption, highlight}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f, fps, config: {damping: 18}});
  const b = spring({frame: f - 6, fps, config: {damping: 18}});
  return (
    <AbsoluteFill style={{perspective: 1600}}>
      <Room />
      <div style={{position: 'absolute', left: 70, top: 470 + Math.sin(f / 14) * 12, transform: `translateX(${(1 - a) * -600}px) rotateY(22deg)`, opacity: a}}><AdsPanel /></div>
      <div style={{position: 'absolute', left: 580, top: 530 + Math.sin((f + 20) / 14) * 12, transform: `translateX(${(1 - b) * 600}px) rotateY(-22deg)`, opacity: b}}><CalendarPanel /></div>
      <Caption text={caption} highlight={highlight} />
    </AbsoluteFill>
  );
};

const FinalCard: React.FC<{lines: string[]; cta: string}> = ({lines, cta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = spring({frame: f - 6 - lines.length * 4, fps, config: {damping: 11}});
  const pulse = 1 + Math.sin(f / 4) * 0.025 * Math.min(1, Math.max(0, f - 30) / 10);
  const sizes = [64, 120, 150, 50, 40];
  const colors = ['#fff', C.cyan, '#fff', '#fff', C.cyan];
  return (
    <AbsoluteFill>
      <Room />
      <AbsoluteFill style={{padding: `${SAFE.story.top}px 110px ${SAFE.story.bottom}px`, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <NexoraLogo variant="logo" theme="dark" height={110} />
        {lines.map((l, i) => {
          const s = spring({frame: f - i * 4, fps, config: {damping: 15}});
          return <div key={i} style={{marginTop: i === 0 ? 50 : 14, fontFamily: i === 4 ? FONT : DISPLAY, fontWeight: i === 4 ? 700 : 900,
            fontSize: sizes[i] ?? 44, lineHeight: 1.08, color: colors[i] ?? '#fff', letterSpacing: i === 4 ? 3 : 0.5, opacity: s,
            transform: `translateY(${(1 - s) * 30}px)`, textShadow: i === 1 || i === 2 ? `0 0 40px ${ELECTRIC}` : 'none',
            ...(i === 4 ? {padding: '12px 30px', border: `3px solid ${C.cyan}`, borderRadius: 999} : {})}}>{l}</div>;
        })}
        <div style={{marginTop: 46, display: 'flex', alignItems: 'center', gap: 18, padding: '30px 54px', borderRadius: 999,
          background: `linear-gradient(135deg, ${C.cyan}, ${ELECTRIC})`, color: BLACK, fontFamily: DISPLAY, fontWeight: 900, fontSize: 44,
          boxShadow: `0 0 70px ${ELECTRIC}`, transform: `scale(${b * pulse})`}}>
          <WhatsAppIcon size={50} color={BLACK} />{cta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// troca de cena: varredura de luz azul rápida (mais leve que a explosão do Promo)
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 10], [-300, 1400], cl);
  const a = interpolate(f, [0, 3, 10], [0, 0.35, 0], cl);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: ELECTRIC, opacity: a}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, left: x, width: 160, transform: 'skewX(-18deg)',
        background: `linear-gradient(90deg, transparent, ${C.cyan}cc, transparent)`, filter: 'blur(8px)'}} />
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{s: SpotScene; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 5], [0, 1], cl);
  let el: React.ReactNode = null;
  if (s.kind === 'photo') el = (<AbsoluteFill><PhotoBg src={s.photo} dur={dur} focus={s.focus} /><Caption text={s.caption} highlight={s.highlight} /></AbsoluteFill>);
  if (s.kind === 'panels') el = <PanelsScene caption={s.caption} highlight={s.highlight} />;
  if (s.kind === 'price') el = (<AbsoluteFill><Room /><Price from={s.from} to={s.to} dur={dur + 6} /></AbsoluteFill>);
  if (s.kind === 'seal') el = (<AbsoluteFill><Room /><Seal lines={s.lines} dur={dur + 6} />{s.caption && <Caption text={s.caption} />}</AbsoluteFill>);
  if (s.kind === 'final') el = <FinalCard lines={s.lines} cta={s.cta} />;
  return <AbsoluteFill style={{opacity: fade}}>{el}</AbsoluteFill>;
};

export const Spot: React.FC<SpotProps> = (p) => {
  const f = useCurrentFrame();
  const frames = spotFrames(p);
  let from = 0;
  const starts = frames.map((d) => { const s = from; from += d; return s; });
  return (
    <AbsoluteFill style={{background: BLACK}}>
      {p.scenes.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={frames[i]}><SceneView s={s} dur={frames[i]} /></Sequence>
      ))}
      {/* flash de luz azul em cada troca de cena */}
      {starts.slice(1).map((st, i) => <Sequence key={`b${i}`} from={st - 3} durationInFrames={11}><CutFlash /></Sequence>)}
      {/* logo fixo no topo, exceto na cena final (que tem o logo grande) */}
      <div style={{position: 'absolute', top: SAFE.story.top, left: SAFE.story.x, opacity: f < starts[starts.length - 1] ? 1 : 0}}>
        <NexoraLogo variant="logo" theme="dark" height={84} />
      </div>
      {p.audioSrc && <Audio src={staticFile(p.audioSrc)} />}
      {p.musicSrc && <Audio src={staticFile(p.musicSrc)} loop volume={p.audioSrc ? 0.14 : 0.6} />}
    </AbsoluteFill>
  );
};
