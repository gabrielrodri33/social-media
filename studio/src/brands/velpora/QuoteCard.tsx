import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FEED_SQUARE, SAFE} from '../../shared/formats';
import {SANS, SERIF, V} from './brand';

export type QuoteCardProps = {
  eyebrow: string; // linha da marca: CARE | COMFORT | EVERYDAY | OUR BRAND
  quote: string;
  emphasis?: string; // trecho da quote em itálico caramelo
  footer: string;
};

// Post estático de marca (feed 1080×1350, conteúdo no quadrado central 1080×1080). Animação só aparece se renderizado como vídeo.
export const QuoteCard: React.FC<QuoteCardProps> = ({eyebrow, quote, emphasis, footer}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const parts = emphasis && quote.includes(emphasis) ? quote.split(emphasis) : [quote];
  return (
    <AbsoluteFill style={{background: V.cream, padding: `${SAFE.feed.top}px ${SAFE.feed.x}px ${SAFE.feed.bottom}px`}}>
      {/* moldura fina em sand */}
      <div style={{position: 'absolute', left: 44, right: 44, top: FEED_SQUARE.top + 10, bottom: FEED_SQUARE.bottom + 10, border: `2px solid ${V.sand}`, borderRadius: 6}} />
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 9, color: V.sage, opacity: o}}>{eyebrow}</div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{width: 64, height: 3, background: V.caramel, marginBottom: 44, opacity: o}} />
        <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 92, lineHeight: 1.12, letterSpacing: -1, color: V.forest,
          opacity: o, transform: `translateY(${(1 - o) * 24}px)`}}>
          {parts.length === 2 ? (
            <>
              {parts[0]}
              <span style={{fontStyle: 'italic', color: V.caramel}}>{emphasis}</span>
              {parts[1]}
            </>
          ) : quote}
        </div>
      </div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 2, color: V.forest, opacity: 0.75 * o}}>{footer}</div>
    </AbsoluteFill>
  );
};
