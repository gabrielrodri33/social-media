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
    // topo escuro (logo sempre sobre navy), meio mais leve (a foto aparece), e véu forte a partir de ~44% (onde o texto começa)
    : `linear-gradient(180deg, ${C.navy}e6 0%, ${C.navy}b3 12%, ${C.navy}4d 26%, ${C.navy}80 36%, ${C.navy}e0 46%, ${C.navy}f5 60%, ${C.navy} 100%)`;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.navy}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transform: `scale(${z})`, transformOrigin: focus}} />
      <AbsoluteFill style={{background: bg}} />
    </AbsoluteFill>
  );
};
