import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FEED_SQUARE, SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {PhotoBg} from './PhotoBg';
import {CtaButton, Hl, Pill} from './ui';

export type PhotoCardProps = {
  photo: string; // caminho em studio/public (ex.: assets/nexora/unsplash/x.jpg)
  focus?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  body?: string;
  button?: string;
};

// Criativo estático de feed 1080×1350 com foto. Todo o conteúdo no quadrado central 1080×1080.
export const PhotoCard: React.FC<PhotoCardProps> = ({photo, focus, eyebrow, title, highlight, body, button}) => (
  <AbsoluteFill>
    <PhotoBg src={photo} dur={1} focus={focus} />
    <AbsoluteFill style={{padding: `${SAFE.feedGrid.top}px ${SAFE.feedGrid.x}px ${SAFE.feedGrid.bottom}px`, justifyContent: 'space-between'}}>
      <NexoraLogo variant="logo" theme="dark" height={80} />
      <div>
        {eyebrow && <Pill>{eyebrow}</Pill>}
        <div style={{marginTop: eyebrow ? 28 : 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: title.length > 40 ? 72 : 86,
          lineHeight: 1.06, letterSpacing: -1.5, color: C.white}}><Hl text={title} highlight={highlight} /></div>
        {body && <div style={{marginTop: 24, fontFamily: FONT, fontSize: 36, lineHeight: 1.38, color: C.ice, maxWidth: 860}}>{body}</div>}
        {button && <div style={{marginTop: 32, display: 'flex'}}><CtaButton label={button} size={36} /></div>}
      </div>
    </AbsoluteFill>
    {/* guia invisível: FEED_SQUARE garante que nada passa de y ${FEED_SQUARE.top}–${1350 - FEED_SQUARE.bottom} */}
  </AbsoluteFill>
);
