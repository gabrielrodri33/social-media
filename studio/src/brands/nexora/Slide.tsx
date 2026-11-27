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
  items?: {text: string; sub?: string; icon?: IconName}[]; // lista (✕, ✓) ou cartões com ícone
  itemStyle?: 'x' | 'check' | 'card';
  note?: string; // caixa de destaque no pé do slide
  art?: 'chat'; // ilustração da capa (celular com conversa genérica)
};
type IconName = 'search' | 'phone' | 'chart' | 'target' | 'shield' | 'chat';

const Icon: React.FC<{name: IconName; size: number; color: string}> = ({name, size, color}) => {
  const st = {fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const d: Record<IconName, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" {...st} /><path d="M15.5 15.5 21 21" {...st} /></>,
    phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" {...st} /><path d="M10.5 18.5h3" {...st} /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...st} /></>,
    target: <><circle cx="12" cy="12" r="9" {...st} /><circle cx="12" cy="12" r="5" {...st} /><circle cx="12" cy="12" r="1.5" {...st} /></>,
    shield: <><path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6l-8-3Z" {...st} /><path d="m8.5 12 2.5 2.5 4.5-5" {...st} /></>,
    chat: <><path d="M4 5h16v11H9l-5 4V5Z" {...st} /><path d="M8 9.5h8M8 12.5h5" {...st} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{d[name]}</svg>;
};

const Mark: React.FC<{kind: 'x' | 'check'; size: number}> = ({kind, size}) => (
  <div style={{width: size, height: size, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: `3px solid ${kind === 'x' ? '#ff6f61' : C.cyan}`, background: kind === 'check' ? `${C.cyan}22` : 'transparent'}}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={kind === 'x' ? '#ff6f61' : C.cyan} strokeWidth={3.2} strokeLinecap="round">
      {kind === 'x' ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="m5 12.5 4.5 4.5L19 7.5" />}
    </svg>
  </div>
);

// Celular com conversa genérica (sem logo de terceiro) para a capa.
const ChatArt: React.FC = () => (
  <div style={{position: 'absolute', right: SAFE.feed.x + 20, bottom: SAFE.feed.bottom + 70, width: 280, height: 410, borderRadius: 44,
    background: '#050d1c', border: `3px solid ${C.sky}55`, boxShadow: `0 30px 90px rgba(0,0,0,.55), 0 0 80px ${C.cyan}22`, padding: 18, transform: 'rotate(6deg)'}}>
    <div style={{height: '100%', borderRadius: 32, background: '#0b1f3a', padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 13, fontFamily: FONT, fontSize: 20}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottom: `1px solid ${C.sky}33`}}>
        <div style={{width: 40, height: 40, borderRadius: '50%', background: `${C.cyan}55`}} />
        <div style={{color: C.ice, fontWeight: 700}}>Recepção</div>
      </div>
      <div style={{alignSelf: 'flex-end', maxWidth: '85%', background: C.cyan, color: C.navy, padding: '12px 16px', borderRadius: '18px 18px 4px 18px', fontWeight: 600}}>Oi! Queria agendar uma avaliação.</div>
      <div style={{alignSelf: 'flex-start', maxWidth: '85%', background: '#ffffff1a', color: C.ice, padding: '12px 16px', borderRadius: '18px 18px 18px 4px'}}>Claro! Qual o melhor dia pra você?</div>
      <div style={{alignSelf: 'flex-end', maxWidth: '85%', background: C.cyan, color: C.navy, padding: '12px 16px', borderRadius: '18px 18px 4px 18px', fontWeight: 600}}>Quinta à tarde 🙂</div>
    </div>
  </div>
);

// Um slide de carrossel (feed 1080×1350, conteúdo no quadrado central 1080×1080). O render-post.sh renderiza cada slide de props.json → slides[].
export const Slide: React.FC<SlideProps> = ({kind, index, total, eyebrow, title, highlight, body, number, button, items, itemStyle = 'x', note, art}) => {
  const dense = !!items?.length;
  const titleSize = kind === 'cover' ? (art ? 76 : title.length > 50 ? 80 : 92) : dense ? (title.length > 40 ? 56 : 62) : title.length > 50 ? 58 : 68;
  return (
    <AbsoluteFill>
      <NxBackground />
      {art === 'chat' && <ChatArt />}
      <AbsoluteFill style={{padding: `${SAFE.feed.top}px ${SAFE.feed.x}px ${SAFE.feed.bottom}px`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <NexoraLogo variant={kind === 'point' ? 'symbol' : 'logo'} theme="dark" height={kind === 'point' ? 64 : 84} />
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: C.sky}}>{index}/{total}</div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {eyebrow && <Pill>{eyebrow}</Pill>}
          {number && (
            <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: dense ? 92 : 120, lineHeight: 1, color: 'transparent',
              WebkitTextStroke: `3px ${C.cyan}`, marginBottom: dense ? 12 : 20}}>{number}</div>
          )}
          <div style={{marginTop: eyebrow ? 32 : 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: titleSize, lineHeight: 1.1,
            letterSpacing: -1.5, color: C.white, maxWidth: art ? 600 : undefined}}><Hl text={title} highlight={highlight} /></div>
          {body && <div style={{marginTop: 32, fontFamily: FONT, fontSize: 36, lineHeight: 1.4, color: C.ice, maxWidth: art ? 520 : 860}}>{body}</div>}
          {items && itemStyle !== 'card' && (
            <div style={{marginTop: 34, display: 'flex', flexDirection: 'column'}}>
              {items.map((it, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 0', borderTop: i ? `1.5px solid ${C.sky}33` : 'none'}}>
                  <Mark kind={itemStyle} size={50} />
                  <div style={{fontFamily: FONT, fontSize: 36, lineHeight: 1.25, color: C.ice}}>{it.text}</div>
                </div>
              ))}
            </div>
          )}
          {items && itemStyle === 'card' && (
            <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14}}>
              {items.map((it, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '18px 26px', borderRadius: 24, border: `2px solid ${C.cyan}66`, background: `${C.navy2}cc`}}>
                  {it.icon && <div style={{flex: 'none', width: 66, height: 66, borderRadius: 18, background: `${C.cyan}1f`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name={it.icon} size={40} color={C.cyan} /></div>}
                  <div>
                    <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, color: C.white}}>{it.text}</div>
                    {it.sub && <div style={{marginTop: 4, fontFamily: FONT, fontSize: 28, lineHeight: 1.3, color: C.ice}}>{it.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {note && (
            <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px', borderRadius: 24, border: `2.5px solid ${C.cyan}`, background: `${C.cyan}14`}}>
              <div style={{flex: 'none', width: 46, height: 46, borderRadius: 12, background: C.cyan, color: C.navy, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>!</div>
              <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 34, lineHeight: 1.3, color: C.white}}>{note}</div>
            </div>
          )}
          {button && <div style={{marginTop: 48, display: 'flex'}}><CtaButton label={button} size={40} /></div>}
        </div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.sky, alignSelf: kind === 'cta' ? 'flex-start' : 'flex-end'}}>
          {kind === 'cta' ? 'Link na bio · @mkt.nexora' : 'Arraste →'}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
