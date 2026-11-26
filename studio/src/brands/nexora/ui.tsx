import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, DISPLAY, FONT} from './brand';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Fundo padrão Nexora: navy, brilho azul e um arco ciano fino (sem tocar no logo).
export const NxBackground: React.FC<{animate?: boolean}> = ({animate = false}) => {
  const f = useCurrentFrame();
  const drift = animate ? Math.sin(f / 40) * 20 : 0;
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <div style={{position: 'absolute', right: -260, top: -260, width: 760, height: 760, borderRadius: '50%', background: '#1a4fa0', filter: 'blur(180px)', opacity: 0.45}} />
      <div style={{position: 'absolute', left: -320, bottom: -420, width: 980, height: 640, borderRadius: '50%',
        border: `3px solid ${C.cyan}44`, transform: `rotate(-12deg) translateX(${drift}px)`}} />
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{children: React.ReactNode; o?: number; size?: number}> = ({children, o = 1, size = 34}) => (
  <div style={{alignSelf: 'flex-start', padding: `${size * 0.45}px ${size * 1.1}px`, borderRadius: 999, border: `2.5px solid ${C.cyan}`,
    color: C.white, fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: size * 0.18, opacity: o,
    transform: `translateY(${(1 - o) * 20}px)`}}>{children}</div>
);

// Texto com um trecho destacado em ciano.
export const Hl: React.FC<{text: string; highlight?: string}> = ({text, highlight}) => {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [a, ...rest] = text.split(highlight);
  return <>{a}<span style={{color: C.cyan}}>{highlight}</span>{rest.join(highlight)}</>;
};

// Revela palavra por palavra; palavras que fazem parte de `highlight` ficam em ciano.
export const WordReveal: React.FC<{text: string; highlight?: string; size: number; start?: number; weight?: number; color?: string}> = ({
  text, highlight, size, start = 0, weight = 700, color = C.white,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(/\s+/);
  // Destaca só o trecho contíguo igual a `highlight` (primeira ocorrência), não toda palavra repetida.
  const hw = (highlight ?? '').split(/\s+/).filter(Boolean);
  let hlStart = -1;
  for (let i = 0; hw.length && i <= words.length - hw.length; i++) {
    if (hw.every((w, j) => words[i + j] === w)) { hlStart = i; break; }
  }
  // Sem trecho contíguo (ex.: "Google Instagram."), cai para palavras soltas, cada uma só uma vez.
  const loose = new Set(hlStart < 0 ? hw : []);
  const isHl = (i: number, w: string) => {
    if (hlStart >= 0) return i >= hlStart && i < hlStart + hw.length;
    if (loose.has(w)) { loose.delete(w); return true; }
    return false;
  };
  const renderWord = (w: string, i: number) => {
    const s = spring({frame: f - start - i * 3, fps, config: {damping: 16}});
    return (
      <span key={i} style={{fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: 1.1, letterSpacing: -1.2,
        color: isHl(i, w) ? C.cyan : color, opacity: s, transform: `translateY(${(1 - s) * 34}px)`}}>{w}</span>
    );
  };
  const gap = size * 0.26;
  // Bloco que não quebra por dentro (salvo se for mais largo que a linha toda): se não cabe, desce inteiro.
  const block = (key: string, children: React.ReactNode[]) => (
    <span key={key} style={{display: 'inline-flex', flexWrap: 'wrap', maxWidth: '100%', columnGap: gap, rowGap: size * 0.06}}>{children}</span>
  );
  // Palavra de 1 letra (ignorando pontuação: "é", "o", "a", "e") nunca fica sozinha no fim da linha:
  // gruda na palavra (ou bloco) seguinte. Encadeia: "e o problema" vira um bloco só.
  const isShort = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').length === 1;
  const glue = (nodes: {node: React.ReactNode; short: boolean}[], keyBase: string) => {
    const out: React.ReactNode[] = [];
    let pending: React.ReactNode[] = [];
    nodes.forEach((n, k) => {
      pending.push(n.node);
      if (n.short && k < nodes.length - 1) return;
      out.push(pending.length > 1 ? block(`${keyBase}-g${k}`, pending) : pending[0]);
      pending = [];
    });
    return out;
  };
  const tokens: {node: React.ReactNode; short: boolean}[] = [];
  for (let i = 0; i < words.length; i++) {
    if (hlStart >= 0 && i === hlStart && hw.length > 1) {
      // Trecho destacado contíguo vira um bloco único (com as palavras curtas internas também grudadas).
      const inner = words.slice(hlStart, hlStart + hw.length).map((w, j) => ({node: renderWord(w, hlStart + j), short: isShort(w)}));
      tokens.push({node: block(`hl-${i}`, glue(inner, `hl-${i}`)), short: false});
      i += hw.length - 1;
    } else {
      tokens.push({node: renderWord(words[i], i), short: isShort(words[i])});
    }
  }
  const items = glue(tokens, 'w');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: gap, rowGap: size * 0.06}}>
      {items}
    </div>
  );
};

export const fadeIn = (f: number, start = 0, len = 12) => interpolate(f, [start, start + len], [0, 1], clamp);

export const WhatsAppIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.8-.1 1.4Z" />
  </svg>
);

export const CtaButton: React.FC<{label: string; scale?: number; size?: number}> = ({label, scale = 1, size = 40}) => (
  <div style={{alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: size * 0.45, padding: `${size * 0.75}px ${size * 1.3}px`,
    borderRadius: 999, background: C.cyan, color: C.navy, fontFamily: FONT, fontWeight: 700, fontSize: size,
    boxShadow: `0 16px 60px ${C.cyan}55`, transform: `scale(${scale})`, transformOrigin: 'left center'}}>
    <WhatsAppIcon size={size * 1.05} color={C.navy} />
    {label}
  </div>
);
