import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {NxBackground} from './ui';

export type StatementCardProps = {eyebrow: string; title: string; highlight?: string; body: string};

// Card estático de posicionamento. Copy vem de content/site.ts (lp-nexora).
export const StatementCard: React.FC<StatementCardProps> = ({eyebrow, title, highlight, body}) => {
  const parts = highlight && title.includes(highlight) ? title.split(highlight) : [title];
  return (
    <AbsoluteFill>
      <NxBackground />
      <AbsoluteFill style={{padding: `${SAFE.feed.top}px ${SAFE.feed.x}px ${SAFE.feed.bottom}px`}}>
      <NexoraLogo variant="logo" theme="dark" height={80} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{alignSelf: 'flex-start', padding: '12px 30px', borderRadius: 999, border: `2.5px solid ${C.cyan}`, color: C.white,
          fontFamily: FONT, fontWeight: 600, fontSize: 28, letterSpacing: 5}}>{eyebrow}</div>
        <div style={{marginTop: 36, fontFamily: DISPLAY, fontWeight: 700, fontSize: 80, lineHeight: 1.08, letterSpacing: -1.5, color: C.white}}>
          {parts.length === 2 ? <>{parts[0]}<span style={{color: C.cyan}}>{highlight}</span>{parts[1]}</> : title}
        </div>
        <div style={{marginTop: 32, fontFamily: FONT, fontSize: 36, lineHeight: 1.4, color: C.ice, maxWidth: 820}}>{body}</div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.sky}}>@mkt.nexora</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
