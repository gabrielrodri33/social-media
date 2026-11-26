import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from './brand';

// Foto de fundo com zoom lento (Ken Burns) + véu navy para o texto ler bem.
// `veil`: 'bottom' (texto embaixo, foto visível em cima) | 'full' (véu uniforme).
export const PhotoBg: React.FC<{src: string; dur: number; veil?: 'bottom' | 'full'; focus?: string}> = ({src, dur, veil = 'bottom', focus = '50% 50%'}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, Math.max(1, dur)], [1.06, 1.16]);
  const bg = veil === 'full'
    ? `linear-gradient(180deg, ${C.navy}cc 0%, ${C.navy}b3 50%, ${C.navy}e6 100%)`
    : `linear-gradient(180deg, ${C.navy}99 0%, ${C.navy}33 22%, ${C.navy}66 42%, ${C.navy}e6 62%, ${C.navy} 100%)`;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${z})`, transformOrigin: focus}} />
      <AbsoluteFill style={{background: bg}} />
    </AbsoluteFill>
  );
};
