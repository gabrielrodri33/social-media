import json,re,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p=json.load(open(os.path.join(ROOT,'fonte/paths.json')))
def bbox(*ds):
    n=[float(x) for d in ds for x in re.findall(r'-?\d+\.?\d*',d)]
    return min(n[0::2]),min(n[1::2]),max(n[0::2]),max(n[1::2])
NAVY,GRAY='#0F2848','#4B5664'
def P(fill,d): return f'<path fill-rule="evenodd" fill="{fill}" d="{d}"/>'
mb=bbox(p['mark_navy'],p['mark_cyan'])
defs=f'<defs><linearGradient id="nx-cyan" gradientUnits="userSpaceOnUse" x1="0" y1="{mb[1]:.1f}" x2="0" y2="{mb[3]:.1f}"><stop offset="0" stop-color="#04E1EF"/><stop offset="1" stop-color="#04AFD6"/></linearGradient></defs>'
def svg(body,box,pad=2):
    x0,y0,x1,y1=box[0]-pad,box[1]-pad,box[2]+pad,box[3]+pad
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.2f} {y0:.2f} {x1-x0:.2f} {y1-y0:.2f}" role="img" aria-label="Nexora">{defs}{body}</svg>\n'
def mark(c): return P(c,p['mark_navy'])+P('url(#nx-cyan)',p['mark_cyan'])
os.makedirs(os.path.join(ROOT,'svg'),exist_ok=True)
allb=bbox(p['mark_navy'],p['mark_cyan'],p['word']); fullb=bbox(*p.values())
files={
 'nexora-simbolo.svg':svg(mark(NAVY),mb),
 'nexora-simbolo-branco.svg':svg(mark('#FFFFFF'),mb),
 'nexora-logo.svg':svg(mark(NAVY)+P(NAVY,p['word']),allb),
 'nexora-logo-branco.svg':svg(mark('#FFFFFF')+P('#FFFFFF',p['word']),allb),
 'nexora-logo-slogan.svg':svg(mark(NAVY)+P(NAVY,p['word'])+P(GRAY,p['tag']),fullb),
}
for f,s in files.items(): open(os.path.join(ROOT,'svg',f),'w').write(s)
print({f:os.path.getsize(os.path.join(ROOT,'svg',f)) for f in files})

# ---- Componente React (fonte única para Remotion / sites) ----
os.makedirs(os.path.join(ROOT,'react'),exist_ok=True)
def vb(box,pad=2): x0,y0,x1,y1=box[0]-pad,box[1]-pad,box[2]+pad,box[3]+pad; return f"{x0:.2f} {y0:.2f} {x1-x0:.2f} {y1-y0:.2f}"
tsx=f'''// GERADO AUTOMATICAMENTE por nexora-brand/fonte/build.py a partir do logo oficial. NÃO EDITE À MÃO.
import React, {{useId}} from 'react';

export const NEXORA_COLORS = {{navy: '{NAVY}', cyanTop: '#04E1EF', cyanBottom: '#04AFD6', gray: '{GRAY}'}} as const;

const P = {{
  markNavy: '{p['mark_navy']}',
  markCyan: '{p['mark_cyan']}',
  word: '{p['word']}',
  tag: '{p['tag']}',
}};
const VB = {{symbol: '{vb(mb)}', logo: '{vb(allb)}', slogan: '{vb(fullb)}'}};
const CY = [{mb[1]:.1f}, {mb[3]:.1f}];

type Props = {{
  /** symbol = só o N · logo = N + NEXORA · slogan = completo */
  variant?: 'symbol' | 'logo' | 'slogan';
  /** light = navy (fundo claro) · dark = branco (fundo escuro). O ciano nunca muda. */
  theme?: 'light' | 'dark';
  height?: number;
  style?: React.CSSProperties;
}};

export const NexoraLogo: React.FC<Props> = ({{variant = 'logo', theme = 'light', height = 100, style}}) => {{
  const id = 'nx' + useId().replace(/:/g, '');
  const main = theme === 'dark' ? '#FFFFFF' : NEXORA_COLORS.navy;
  const [, , w, h] = VB[variant].split(' ').map(Number);
  return (
    <svg viewBox={{VB[variant]}} height={{height}} width={{(height * w) / h}} style={{style}} role="img" aria-label="Nexora">
      <defs>
        <linearGradient id={{id}} gradientUnits="userSpaceOnUse" x1="0" y1={{CY[0]}} x2="0" y2={{CY[1]}}>
          <stop offset="0" stopColor={{NEXORA_COLORS.cyanTop}} /><stop offset="1" stopColor={{NEXORA_COLORS.cyanBottom}} />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" fill={{main}} d={{P.markNavy}} />
      <path fillRule="evenodd" fill={{`url(#${{id}})`}} d={{P.markCyan}} />
      {{variant !== 'symbol' && <path fillRule="evenodd" fill={{main}} d={{P.word}} />}}
      {{variant === 'slogan' && <path fillRule="evenodd" fill={{theme === 'dark' ? '#C9D3E0' : NEXORA_COLORS.gray}} d={{P.tag}} />}}
    </svg>
  );
}};
'''
open(os.path.join(ROOT,'react/NexoraLogo.tsx'),'w').write(tsx)
print('react/NexoraLogo.tsx', os.path.getsize(os.path.join(ROOT,'react/NexoraLogo.tsx')))

# ---- Favicon: símbolo oficial branco sobre quadrado navy arredondado ----
x0,y0,x1,y1=mb; side=max(x1-x0,y1-y0)*1.45; cx,cy=(x0+x1)/2,(y0+y1)/2
fx,fy=cx-side/2,cy-side/2
fav=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fx:.2f} {fy:.2f} {side:.2f} {side:.2f}">{defs}'
     f'<rect x="{fx:.2f}" y="{fy:.2f}" width="{side:.2f}" height="{side:.2f}" rx="{side*0.22:.2f}" fill="{NAVY}"/>{mark("#FFFFFF")}</svg>\n')
open(os.path.join(ROOT,'svg','nexora-favicon.svg'),'w').write(fav)
app_dir=os.path.join(os.path.dirname(ROOT),'app')
if os.path.isdir(app_dir):  # LP Next.js: favicon gerado daqui, não edite app/icon.svg à mão
    open(os.path.join(app_dir,'icon.svg'),'w').write(fav)
print('favicon ok')
