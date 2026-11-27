import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE} from '../../shared/formats';
import {C, DISPLAY, FONT, NexoraLogo} from './brand';
import {Hl, NxBackground} from './ui';

// Criativo estático de feed (1080×1350, conteúdo no quadrado central): texto à esquerda + celular com conversa
// genérica à direita (sem logo nem interface de terceiro). Cena ilustrativa, não é conversa real de cliente.
export type ChatMsg = {from: 'in' | 'out' | 'sys'; text: string; time?: string};
export type ChatCardProps = {title: string; highlight?: string; body?: string; contact: string; messages: ChatMsg[]; footer?: string};

const Bubble: React.FC<{m: ChatMsg}> = ({m}) => {
  if (m.from === 'sys') return (
    <div style={{alignSelf: 'center', margin: '6px 0', padding: '8px 18px', borderRadius: 999, background: '#ff6f6126', border: '1.5px solid #ff6f61aa',
      color: '#ffb3aa', fontFamily: FONT, fontWeight: 700, fontSize: 21, letterSpacing: 1}}>{m.text}</div>
  );
  const out = m.from === 'out';
  return (
    <div style={{alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: '86%', padding: '12px 16px 8px', fontFamily: FONT, fontSize: 23, lineHeight: 1.3,
      background: out ? C.cyan : '#ffffff17', color: out ? C.navy : C.ice, fontWeight: out ? 600 : 400,
      borderRadius: out ? '20px 20px 6px 20px' : '20px 20px 20px 6px'}}>
      {m.text}
      {m.time && <div style={{marginTop: 4, textAlign: 'right', fontSize: 17, fontWeight: 600, opacity: 0.65}}>{m.time}</div>}
    </div>
  );
};

export const ChatCard: React.FC<ChatCardProps> = ({title, highlight, body, contact, messages, footer = 'Fale com a Nexora · link na bio'}) => (
  <AbsoluteFill>
    <NxBackground />
    <AbsoluteFill style={{padding: `${SAFE.feed.top}px ${SAFE.feed.x}px ${SAFE.feed.bottom}px`, flexDirection: 'column'}}>
      <NexoraLogo variant="logo" theme="dark" height={80} />
      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 40}}>
        <div style={{flex: 1}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, lineHeight: 1.1, letterSpacing: -1.5, color: C.white, whiteSpace: 'pre-line'}}><Hl text={title} highlight={highlight} /></div>
          {body && <div style={{marginTop: 30, fontFamily: FONT, fontSize: 33, lineHeight: 1.4, color: C.ice}}>{body}</div>}
        </div>
        <div style={{flex: 'none', width: 400, height: 720, borderRadius: 52, background: '#040b18', padding: 16,
          border: `3px solid ${C.sky}55`, boxShadow: `0 30px 90px rgba(0,0,0,.55), 0 0 90px ${C.cyan}22`}}>
          <div style={{height: '100%', borderRadius: 38, background: '#0b1f3a', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '26px 22px 18px', borderBottom: `1px solid ${C.sky}33`, background: '#0e2747'}}>
              <div style={{width: 46, height: 46, borderRadius: '50%', background: `${C.sky}55`}} />
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.ice}}>{contact}</div>
            </div>
            <div style={{flex: 1, padding: '22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14}}>
              {messages.map((m, i) => <Bubble key={i} m={m} />)}
            </div>
          </div>
        </div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.sky}}>{footer}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
