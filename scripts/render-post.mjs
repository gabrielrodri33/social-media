#!/usr/bin/env node
// Renderiza o dia de um post: node scripts/render-post.mjs brands/<marca>/posts/<dia> [--only=feed|story]
// - post.md + props.json  → feed (still), carrossel (um PNG por slide) ou reel (MP4 + capa PNG)
// - story.md + story.props.json → story (PNG)
// - criativo.md + criativo.props.json → criativo estático do dia (PNG 1080×1350), opcional
// --only=feed|story|criativo
// - Reel com voice.mp3 + voice-timings.json (gerados por scripts/tts.mjs) sai narrado e sincronizado.
// Saída em <dia>/render/.
import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith('--')) ?? '');
const only = (args.find((a) => a.startsWith('--only=')) ?? '').split('=')[1];
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const studio = path.join(root, 'studio');
const slug = path.basename(dir);
const out = path.join(dir, 'render');
const tmp = path.join(studio, 'out', '_props');
mkdirSync(out, {recursive: true});
mkdirSync(tmp, {recursive: true});

const fm = (file) => {
  const m = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  const o = {};
  for (const line of (m?.[1] ?? '').split('\n')) {
    const mm = line.match(/^(\w+):\s*([^#]*?)\s*(#.*)?$/);
    if (mm) o[mm[1]] = mm[2];
  }
  return o;
};

const hs = (() => {
  const base = '/opt/pw-browsers';
  if (!existsSync(base)) return [];
  const d = readdirSync(base).find((x) => x.startsWith('chromium_headless_shell-'));
  const bin = d && path.join(base, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  return bin && existsSync(bin) ? [`--browser-executable=${bin}`] : [];
})();

const remotion = (cmd, comp, file, props, extra = []) => {
  const pf = path.join(tmp, `${slug}-${path.basename(file)}.json`);
  writeFileSync(pf, JSON.stringify(props));
  execFileSync('npx', ['remotion', cmd, 'src/index.ts', comp, file, `--props=${pf}`, ...extra, ...hs], {cwd: studio, stdio: ['ignore', 'ignore', 'inherit']});
  console.log('OK', path.relative(root, file));
};

const renderOne = (mdFile, propsFile, suffix) => {
  const meta = fm(mdFile);
  const props = JSON.parse(readFileSync(propsFile, 'utf8'));
  const comp = meta.composition;
  // Cenas 3D (Three.js) precisam de WebGL por software no cloud: frontmatter `gl: swangle`.
  const glFlag = meta.gl ? [`--gl=${meta.gl}`] : [];
  if (!comp) throw new Error(`${mdFile} sem composition:`);
  const name = `${slug}${suffix}`;
  if (meta.format === 'carousel') {
    const total = props.slides.length;
    props.slides.forEach((s, i) => remotion('still', comp, path.join(out, `${name}-${String(i + 1).padStart(2, '0')}.png`), {...s, index: i + 1, total}));
  } else if (meta.format === 'reel') {
    const mp3 = path.join(dir, 'voice.mp3');
    const tj = path.join(dir, 'voice-timings.json');
    if (existsSync(mp3) && existsSync(tj)) {
      mkdirSync(path.join(studio, 'public', 'voice'), {recursive: true});
      copyFileSync(mp3, path.join(studio, 'public', 'voice', `${slug}.mp3`));
      Object.assign(props, {audioSrc: `voice/${slug}.mp3`}, JSON.parse(readFileSync(tj, 'utf8')));
    } else {
      console.log('(sem voice.mp3: reel sai só com texto na tela)');
    }
    remotion('render', comp, path.join(out, `${name}.mp4`), props, glFlag);
    remotion('still', comp, path.join(out, `${name}-capa.png`), props, [`--frame=${meta.frame || 45}`, ...glFlag]);
  } else {
    remotion('still', comp, path.join(out, `${name}.png`), props, [`--frame=${meta.frame || 0}`, ...glFlag]);
  }
};

// Texto para publicar pelo celular (sobe ao Drive junto com as peças).
const writeLegenda = () => {
  const post = readFileSync(path.join(dir, 'post.md'), 'utf8');
  const sec = (n) => post.match(new RegExp(`## ${n}\\n([\\s\\S]*?)(?=\\n## |$)`))?.[1].trim() ?? '';
  const story = existsSync(path.join(dir, 'story.md')) ? readFileSync(path.join(dir, 'story.md'), 'utf8').split('## Como publicar\n')[1]?.trim() ?? '' : '';
  const brand = dir.match(/brands\/([^/]+)\//)?.[1] ?? '';
  writeFileSync(path.join(out, 'LEGENDA.txt'), `${slug} (${brand})\n\nLEGENDA DO FEED\n\n${sec('Legenda')}\n\n${sec('Hashtags')}\n\n---\nSTORY DO DIA\n${story}\n`);
  console.log('OK', path.relative(root, path.join(out, 'LEGENDA.txt')));
};

if (only !== 'story' && existsSync(path.join(dir, 'post.md'))) renderOne(path.join(dir, 'post.md'), path.join(dir, 'props.json'), '');
if (only !== 'story' && only !== 'feed' || only === 'criativo') { if (existsSync(path.join(dir, 'criativo.md'))) renderOne(path.join(dir, 'criativo.md'), path.join(dir, 'criativo.props.json'), '-criativo'); }
if (only !== 'feed' && only !== 'criativo' && existsSync(path.join(dir, 'story.md'))) renderOne(path.join(dir, 'story.md'), path.join(dir, 'story.props.json'), '-story');
if (existsSync(path.join(dir, 'post.md'))) writeLegenda();
