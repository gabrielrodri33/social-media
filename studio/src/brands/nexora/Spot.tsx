import React from 'react';
import {AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {PhotoBg} from './PhotoBg';
import {AdsPanel, BLACK, CalendarPanel, ELECTRIC, Price, Room, Seal} from './Promo';
import {WhatsAppIcon} from './ui';

// Spot narrado (reel 1080×1920): locução + legenda grande + cortes por cena, sincronizados pelo voice-timings.json.
// Cada cena = uma linha do voice.txt. kind decide o visual.
type Timing = {line?: number; weight?: number}; // line: índice da fala (voice.txt) desta cena; várias cenas podem dividir a mesma fala
export type SpotScene = Timing & (
  | {kind: 'photo'; caption: string; highlight?: string; photo: string; focus?: string; photos?: string[]}
  | {kind: 'title'; lines: string[]; highlight?: string}
  | {kind: 'panels'; caption: string; highlight?: string}
  | {kind: 'price'; caption?: string; from: string; to: string}
  | {kind: 'seal'; caption?: string; lines: [string, string]}
  | {kind: 'final'; lines: string[]; cta?: string; sizes?: number[]; pillIndex?: number});

export type SpotProps = {
  scenes: SpotScene[];
  audioSrc?: string;
  timings?: number[];
  audioDuration?: number;
  musicSrc?: string;
  tail?: number; // segundos depois do fim da fala (segura a cena final)
};

const TAIL = 2.2; // segura a cena final ~3 s depois do "Chame agora!"
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const spotFrames = (p: SpotProps): number[] => {
  const tail = p.tail ?? TAIL;
  const lineOf = (i: number) => p.scenes[i].line ?? i;
  const nLines = Math.max(...p.scenes.map((_, i) => lineOf(i))) + 1;
  let lineDur: number[];
  if (p.timings && p.audioDuration && p.timings.length === nLines) {
    const ends = [...p.timings.slice(1), p.audioDuration + tail];
    lineDur = p.timings.map((t, i) => ends[i] - t);
  } else {
    lineDur = new Array(nLines).fill(2.6);
    lineDur[nLines - 1] += tail;
  }
  return p.scenes.map((sc, i) => {
    const group = p.scenes.filter((_, j) => lineOf(j) === lineOf(i));
    const total = group.reduce((a, g) => a + (g.weight ?? 1), 0);
    return Math.max(1, Math.round((lineDur[lineOf(i)] * (sc.weight ?? 1) / total) * FPS));
  });
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

const FinalCard: React.FC<{lines: string[]; cta?: string; sizes?: number[]; pillIndex?: number}> = ({lines, cta, sizes: sz, pillIndex}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = spring({frame: f - 6 - lines.length * 4, fps, config: {damping: 11}});
  const pulse = 1 + Math.sin(f / 4) * 0.025 * Math.min(1, Math.max(0, f - 30) / 10);
  const sizes = sz ?? [64, 120, 150, 50, 40];
  const pill = pillIndex ?? 4;
  const colors = lines.map((_, i) => (i === pill ? C.cyan : sz ? '#fff' : ['#fff', C.cyan, '#fff', '#fff', C.cyan][i] ?? '#fff'));
  return (
    <AbsoluteFill>
      <Room />
      <AbsoluteFill style={{padding: `${SAFE.story.top}px 110px ${SAFE.story.bottom}px`, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <NexoraLogo variant="logo" theme="dark" height={110} />
        {lines.map((l, i) => {
          const s = spring({frame: f - i * 4, fps, config: {damping: 15}});
          return <div key={i} style={{marginTop: i === 0 ? 50 : 14, fontFamily: i === pill ? FONT : DISPLAY, fontWeight: i === pill ? 700 : 900,
            fontSize: sizes[i] ?? 44, lineHeight: 1.08, color: colors[i] ?? '#fff', letterSpacing: i === pill ? 3 : 0.5, opacity: s,
            transform: `translateY(${(1 - s) * 30}px)`, textShadow: !sz && (i === 1 || i === 2) ? `0 0 40px ${ELECTRIC}` : 'none',
            ...(i === pill ? {padding: '12px 30px', border: `3px solid ${C.cyan}`, borderRadius: 999, marginTop: 34} : {})}}>{l}</div>;
        })}
        {cta && <div style={{marginTop: 46, display: 'flex', alignItems: 'center', gap: 18, padding: '30px 54px', borderRadius: 999,
          background: `linear-gradient(135deg, ${C.cyan}, ${ELECTRIC})`, color: BLACK, fontFamily: DISPLAY, fontWeight: 900, fontSize: 44,
          boxShadow: `0 0 70px ${ELECTRIC}`, transform: `scale(${b * pulse})`}}>
          <WhatsAppIcon size={50} color={BLACK} />{cta}
        </div>}
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

// várias fotos na mesma cena (tour): crossfade entre elas, cada uma com seu zoom lento
const PhotoTour: React.FC<{photos: string[]; dur: number; focus?: string}> = ({photos, dur, focus}) => {
  const f = useCurrentFrame();
  const each = dur / photos.length;
  return (
    <AbsoluteFill>
      {photos.map((ph, i) => {
        const st = i * each;
        const o = i === 0 ? interpolate(f, [st + each - 6, st + each + 6], [1, 0], cl)
          : interpolate(f, [st - 6, st + 6, st + each - 6, st + each + 6], [0, 1, 1, i === photos.length - 1 ? 1 : 0], cl);
        return <AbsoluteFill key={ph} style={{opacity: o}}><Sequence from={Math.round(st - 6)}><PhotoBg src={ph} dur={each + 12} focus={focus} veil="tour" /></Sequence></AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{lines: string[]; highlight?: string}> = ({lines, highlight}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Room />
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1100, height: 900, transform: 'translate(-50%, -50%)',
        background: `radial-gradient(ellipse, ${ELECTRIC}55 0%, transparent 65%)`}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 70px'}}>
        {lines.map((l, i) => {
          const sp = spring({frame: f - i * 5, fps, config: {damping: 12}});
          const hl = highlight && l.includes(highlight);
          return <div key={i} style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: l.length > 10 ? 118 : 170, lineHeight: 1.02,
            color: hl ? C.cyan : '#fff', letterSpacing: 1, transform: `scale(${0.6 + sp * 0.4})`, opacity: sp,
            textShadow: `0 0 50px ${ELECTRIC}, 0 0 110px ${ELECTRIC}88`}}>{l}</div>;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{s: SpotScene; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 5], [0, 1], cl);
  let el: React.ReactNode = null;
  if (s.kind === 'photo') el = (<AbsoluteFill>{s.photos && s.photos.length > 1 ? <PhotoTour photos={s.photos} dur={dur} focus={s.focus} /> : <PhotoBg src={s.photo} dur={dur} focus={s.focus} />}<Caption text={s.caption} highlight={s.highlight} /></AbsoluteFill>);
  if (s.kind === 'title') el = <TitleScene lines={s.lines} highlight={s.highlight} />;
  if (s.kind === 'panels') el = <PanelsScene caption={s.caption} highlight={s.highlight} />;
  if (s.kind === 'price') el = (<AbsoluteFill><Room /><Price from={s.from} to={s.to} dur={dur + 6} /></AbsoluteFill>);
  if (s.kind === 'seal') el = (<AbsoluteFill><Room /><Seal lines={s.lines} dur={dur + 6} />{s.caption && <Caption text={s.caption} />}</AbsoluteFill>);
  if (s.kind === 'final') el = <FinalCard lines={s.lines} cta={s.cta} sizes={s.sizes} pillIndex={s.pillIndex} />;
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
