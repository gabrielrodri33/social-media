import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {CtaButton, Hl, NxBackground, Pill} from './ui';

export type SlideProps = {
  kind: 'cover' | 'point' | 'cta';
  index: number; // 1-based
  total: number;
  eyebrow?: string;
  title: string;
  highlight?: string;
  body?: string;
  number?: string; // ex.: "01" nos slides de ponto
  button?: string; // slide de CTA
};

// Um slide de carrossel (feed 1080×1350, conteúdo no quadrado central 1080×1080). O render-post.sh renderiza cada slide de props.json → slides[].
export const Slide: React.FC<SlideProps> = ({kind, index, total, eyebrow, title, highlight, body, number, button}) => {
  const titleSize = kind === 'cover' ? (title.length > 50 ? 80 : 92) : title.length > 50 ? 58 : 68;
  return (
    <AbsoluteFill>
      <NxBackground />
      <AbsoluteFill style={{padding: `${SAFE.feed.top}px ${SAFE.feed.x}px ${SAFE.feed.bottom}px`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <NexoraLogo variant={kind === 'point' ? 'symbol' : 'logo'} theme="dark" height={kind === 'point' ? 64 : 84} />
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: C.sky}}>{index}/{total}</div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {eyebrow && <Pill>{eyebrow}</Pill>}
          {number && (
            <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 120, lineHeight: 1, color: 'transparent',
              WebkitTextStroke: `3px ${C.cyan}`, marginBottom: 20}}>{number}</div>
          )}
          <div style={{marginTop: eyebrow ? 32 : 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: titleSize, lineHeight: 1.1,
            letterSpacing: -1.5, color: C.white}}><Hl text={title} highlight={highlight} /></div>
          {body && <div style={{marginTop: 32, fontFamily: FONT, fontSize: 36, lineHeight: 1.4, color: C.ice, maxWidth: 860}}>{body}</div>}
          {button && <div style={{marginTop: 48, display: 'flex'}}><CtaButton label={button} size={40} /></div>}
        </div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.sky, alignSelf: kind === 'cta' ? 'flex-start' : 'flex-end'}}>
          {kind === 'cta' ? 'Link na bio · @mkt.nexora' : 'Arraste →'}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
