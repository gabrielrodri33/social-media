import React from 'react';
import {AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {SAFE, FPS} from '../../shared/formats';
import {C, FONT, NexoraLogo} from './brand';
import {CtaButton, NxBackground, Pill, WordReveal, clamp, fadeIn} from './ui';
import {PhotoBg} from './PhotoBg';

export type ReelScene = {
  text: string; // frase principal (= uma linha do voice.txt)
  highlight?: string; // palavras em ciano
  eyebrow?: string; // pílula acima do texto
  sub?: string; // apoio menor abaixo
  button?: string; // se presente, cena de CTA com botão WhatsApp
  photo?: string; // foto de fundo (caminho em studio/public, ex.: assets/nexora/unsplash/x.jpg)
  focus?: string; // object-position da foto (ex.: '50% 30%')
};

export type ReelProps = {
  scenes: ReelScene[];
  audioSrc?: string; // caminho em studio/public (o render-post.sh copia o voice.mp3)
  timings?: number[]; // início de cada cena em segundos (vem do ElevenLabs with-timestamps)
  audioDuration?: number; // segundos
  musicSrc?: string; // trilha de fundo (caminho em studio/public), em loop e volume baixo
};

const TAIL = 1.2; // segundos de respiro no fim

// Sem áudio: tempo de leitura. Com áudio: o tempo da fala.
export const sceneFrames = (p: ReelProps): number[] => {
  if (p.timings && p.audioDuration && p.timings.length === p.scenes.length) {
    const ends = [...p.timings.slice(1), p.audioDuration + TAIL];
    return p.timings.map((t, i) => Math.max(1, Math.round((ends[i] - t) * FPS)));
  }
  return p.scenes.map((s) => {
    const words = (s.text + ' ' + (s.sub ?? '')).trim().split(/\s+/).length;
    const sec = Math.max(2.4, 1.0 + words * 0.36) + (s.button ? 1.5 : 0);
    return Math.round(sec * FPS);
  });
};

export const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = ({props}) => ({
  durationInFrames: sceneFrames(props).reduce((a, b) => a + b, 0),
});

const Scene: React.FC<{s: ReelScene; dur: number; last: boolean}> = ({s, dur, last}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = last ? 1 : interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const size = s.text.length > 70 ? 84 : s.text.length > 40 ? 98 : 116;
  const words = s.text.split(/\s+/).length;
  const btn = spring({frame: f - words * 3 - 8, fps, config: {damping: 12}});
  const pulse = 1 + Math.sin(f / 5) * 0.02 * Math.min(1, Math.max(0, f - 30) / 30);
  return (
    <AbsoluteFill style={{opacity: out}}>
    {s.photo && <PhotoBg src={s.photo} dur={dur} focus={s.focus} />}
    <AbsoluteFill style={{padding: `0 170px ${s.photo ? SAFE.story.bottom + 40 : 0}px ${SAFE.story.x}px`, justifyContent: s.photo ? 'flex-end' : 'center'}}>
      {s.eyebrow && <Pill o={fadeIn(f)}>{s.eyebrow}</Pill>}
      <div style={{marginTop: s.eyebrow ? 44 : 0}}>
        <WordReveal text={s.text} highlight={s.highlight} size={size} start={4} />
      </div>
      {s.sub && (
        <div style={{marginTop: 38, fontFamily: FONT, fontSize: 40, lineHeight: 1.38, color: C.ice, opacity: fadeIn(f, words * 3 + 4)}}>{s.sub}</div>
      )}
      {s.button && <div style={{marginTop: 64, display: 'flex'}}><CtaButton label={s.button} scale={btn * pulse} size={42} /></div>}
    </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = (p) => {
  const f = useCurrentFrame();
  const frames = sceneFrames(p);
  let from = 0;
  return (
    <AbsoluteFill>
      <NxBackground animate />
      {p.scenes.map((s, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={frames[i]}>
            <Scene s={s} dur={frames[i]} last={i === p.scenes.length - 1} />
          </Sequence>
        );
        from += frames[i];
        return el;
      })}
      {/* logo por cima das fotos */}
      <div style={{position: 'absolute', top: SAFE.story.top, left: SAFE.story.x, opacity: fadeIn(f, 0, 15)}}>
        <NexoraLogo variant="logo" theme="dark" height={96} />
      </div>
      {p.audioSrc && <Audio src={staticFile(p.audioSrc)} />}
      {p.musicSrc && <Audio src={staticFile(p.musicSrc)} loop volume={p.audioSrc ? 0.12 : 0.35} />}
    </AbsoluteFill>
  );
};
