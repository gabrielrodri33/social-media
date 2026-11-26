#!/usr/bin/env node
// Extrai frames para revisão visual: node scripts/frames.mjs brands/<marca>/posts/<dia>
// Reel: frame no início, 1 por cena (quando o texto já entrou) e no fim. Stills: lista os PNGs.
// Saída: studio/out/frames/<dia>/ (fora do git). Imprime os caminhos para o revisor abrir com Read.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? '');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const slug = path.basename(dir);
const render = path.join(dir, 'render');
const out = path.join(root, 'studio', 'out', 'frames', slug);
mkdirSync(out, {recursive: true});
const bin = path.join(root, 'studio', 'node_modules', '@remotion', 'compositor-linux-x64-gnu');
const env = {...process.env, LD_LIBRARY_PATH: bin};
const FPS = 30;

// Mesma regra de tempo de studio/src/brands/nexora/Reel.tsx (sceneFrames). Se mudar lá, mude aqui.
const sceneStarts = (p) => {
  let frames;
  if (p.timings && p.audioDuration && p.timings.length === p.scenes.length) {
    const ends = [...p.timings.slice(1), p.audioDuration + 1.2];
    frames = p.timings.map((t, i) => Math.max(1, Math.round((ends[i] - t) * FPS)));
  } else {
    frames = p.scenes.map((s) => {
      const words = `${s.text} ${s.sub ?? ''}`.trim().split(/\s+/).length;
      return Math.round((Math.max(2.4, 1.0 + words * 0.36) + (s.button ? 1.5 : 0)) * FPS);
    });
  }
  let acc = 0;
  return frames.map((f) => { const s = acc; acc += f; return {start: s, len: f}; });
};

if (!existsSync(render)) { console.error(`sem pasta render/ em ${dir}`); process.exit(1); }
const files = readdirSync(render).sort();
const size = (file) => execFileSync(path.join(bin, 'ffprobe'), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', file], {env}).toString().trim();
for (const f of files.filter((x) => x.endsWith('.png'))) console.log(`STILL ${size(path.join(render, f))} ${path.join(render, f)}`);
for (const f of files.filter((x) => x.endsWith('.mp4'))) {
  const mp4 = path.join(render, f);
  const dur = Number(execFileSync(path.join(bin, 'ffprobe'), ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], {env}).toString());
  const props = JSON.parse(readFileSync(path.join(dir, 'props.json'), 'utf8'));
  const tj = path.join(dir, 'voice-timings.json');
  if (existsSync(tj)) Object.assign(props, JSON.parse(readFileSync(tj, 'utf8')));
  const shots = [['inicio', 0.3]];
  // Frame "texto completo" de cada cena: 85% da duração da cena (antes do fade de saída).
  sceneStarts(props).forEach((s, i) => shots.push([`cena${i + 1}`, (s.start + s.len * 0.85) / FPS]));
  shots.push(['fim', Math.max(0, dur - 0.1)]);
  for (const [name, t] of shots) {
    const png = path.join(out, `${name}.png`);
    execFileSync(path.join(bin, 'ffmpeg'), ['-loglevel', 'error', '-y', '-ss', t.toFixed(2), '-i', mp4, '-frames:v', '1', png], {env});
    console.log(`FRAME ${name} t=${t.toFixed(2)}s ${png}`);
  }
  console.log(`VIDEO ${size(mp4)} ${f}: ${dur.toFixed(2)}s`);
}
