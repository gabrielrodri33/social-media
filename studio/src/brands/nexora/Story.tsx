import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {Hl, NxBackground, Pill} from './ui';

export type StoryProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  body?: string;
  // Espaço livre reservado para a figurinha que é colocada no app (enquete, quiz, caixa, link).
  sticker: 'poll' | 'quiz' | 'question' | 'link' | 'none';
};

// Story estático 1080×1920. A figurinha interativa é adicionada no Instagram, na área vazia de baixo.
export const Story: React.FC<StoryProps> = ({eyebrow, title, highlight, body, sticker}) => {
  const reserve = sticker === 'none' ? 0 : sticker === 'link' ? 260 : 520;
  return (
    <AbsoluteFill>
      <NxBackground />
      <AbsoluteFill style={{padding: `${SAFE.story.top}px ${SAFE.story.x}px ${SAFE.story.bottom + reserve}px`}}>
        <NexoraLogo variant="logo" theme="dark" height={84} />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {eyebrow && <Pill>{eyebrow}</Pill>}
          <div style={{marginTop: eyebrow ? 44 : 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: title.length > 55 ? 84 : 96,
            lineHeight: 1.1, letterSpacing: -1.5, color: C.white}}><Hl text={title} highlight={highlight} /></div>
          {body && <div style={{marginTop: 36, fontFamily: FONT, fontSize: 42, lineHeight: 1.4, color: C.ice}}>{body}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
