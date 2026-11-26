#!/usr/bin/env node
// Checagem automática de um dia de post: node scripts/check-post.mjs brands/<marca>/posts/<dia>
// - termos de brands/<marca>/compliance.json (proibidos → exit 1; atenção → aviso)
// - frontmatter (composition/format/date), voice.txt × props.scenes, legenda ≤ 2.200, hashtags ≤ 30 (recomenda ≤ 10)
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? '');
const m = dir.match(/brands\/([^/]+)\/posts\/([^/]+)/);
if (!m || !existsSync(dir)) {
  console.error('Uso: node scripts/check-post.mjs brands/<marca>/posts/<dia>');
  process.exit(2);
}
const [, brand, day] = m;
const root = dir.slice(0, dir.indexOf('/brands/'));
const comp = JSON.parse(readFileSync(path.join(root, 'brands', brand, 'compliance.json'), 'utf8'));
const errors = [], warns = [], ok = [];

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const read = (f) => (existsSync(path.join(dir, f)) ? readFileSync(path.join(dir, f), 'utf8') : null);
const files = ['post.md', 'story.md', 'criativo.md', 'props.json', 'story.props.json', 'criativo.props.json', 'voice.txt'];

// 1) termos
// Devolve as ocorrências com posição: [{m, i}]
const find = (term, text) => {
  let re;
  if (term.startsWith('re:')) re = new RegExp(term.slice(3), 'g');
  else {
    const t = norm(term);
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    re = /[a-z0-9]/.test(t) ? new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, 'g') : new RegExp(esc, 'g');
  }
  return [...text.matchAll(re)].map((x) => ({m: x[0], i: x.index}));
};
// Termo proibido logo depois de negação ("nao garantimos", "never guaranteed") vira atenção: o revisor confirma.
const negated = (text, i) => /(^|[^a-z])(nao|nunca|jamais|nem|not|never|no)\s+(\S+\s+){0,2}$/.test(text.slice(Math.max(0, i - 40), i));
for (const f of files) {
  let raw = read(f);
  if (raw === null) continue;
  // Nos props.json, só os campos de TEXTO vão para a varredura (foto, enquadramento e áudio não são copy).
  if (f.endsWith('.json')) {
    const TXT = new Set(['text', 'highlight', 'eyebrow', 'sub', 'button', 'title', 'body', 'quote', 'emphasis', 'footer']);
    const acc = [];
    const walk = (o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (typeof v === 'string' && TXT.has(k)) acc.push(v); else walk(v); } };
    walk(JSON.parse(raw));
    raw = acc.join('\n');
  }
  // As seções de notas internas não vão para o público: não entram na varredura.
  const pub = raw.replace(/## (Notas de aprovação|Revisões|Bloqueio de revisão|Resultado)[\s\S]*?(?=\n## |$)/g, '');
  // URLs saem da varredura (ex.: %C3%A1 de link do WhatsApp não é porcentagem).
  const text = norm(pub.replace(/https?:\/\/\S+/g, ' '));
  for (const t of comp.proibidos) {
    for (const {m, i} of find(t, text)) {
      if (negated(text, i)) warns.push(`atenção: "${m}" (termo proibido) em ${f}, mas após negação: confirmar que é negação`);
      else errors.push(`PROIBIDO "${m}" (regra ${t}) em ${f}`);
    }
  }
  for (const t of comp.atencao) {
    const hits = find(t, text);
    if (hits.length) warns.push(`atenção "${[...new Set(hits.map((h) => h.m))].join('", "')}" em ${f} (${hits.length}x): justificar no relatório`);
  }
}

// 2) frontmatter
const fm = (raw) => Object.fromEntries([...(raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').matchAll(/^(\w+):[ \t]*([^#\n]*?)[ \t]*(?:#.*)?$/gm)].map((x) => [x[1], x[2]]));
for (const f of ['post.md', 'story.md', 'criativo.md']) {
  const raw = read(f);
  if (raw === null) { if (f !== 'criativo.md') (f === 'post.md' ? errors : warns).push(`${f} não existe`); continue; }
  const meta = fm(raw);
  const miss = ['composition', 'format', 'date'].filter((k) => !meta[k]);
  if (meta.format === 'feed' || meta.format === 'carousel' || meta.format === 'reel' || meta.format === 'story') {
    if (miss.length) errors.push(`${f}: frontmatter sem ${miss.join(', ')}`); else ok.push(`${f}: frontmatter ok`);
  } else if (!(f === 'post.md' && meta.composition === '')) {
    errors.push(`${f}: format inválido ("${meta.format ?? ''}")`);
  }
  if (meta.date && !day.startsWith(meta.date)) errors.push(`${f}: date ${meta.date} não bate com a pasta ${day}`);
  if (/^status:\s*(approved|published)/m.test(raw)) warns.push(`${f}: status approved/published (só o Gabriel marca)`);
}

// 3) voz × cenas
const post = read('post.md') ?? '';
const meta = fm(post);
const props = read('props.json') ? JSON.parse(read('props.json')) : {};
if (meta.format === 'reel') {
  const voice = read('voice.txt');
  const scenes = props.scenes?.length ?? 0;
  if (voice === null) warns.push('reel sem voice.txt (sai só com texto na tela)');
  else {
    const lines = voice.split('\n').map((l) => l.trim()).filter(Boolean).length;
    if (lines !== scenes) errors.push(`voice.txt tem ${lines} linhas, props.scenes tem ${scenes}`);
    else ok.push(`voice.txt: ${lines} linhas = ${scenes} cenas`);
  }
}

// 4) legenda e hashtags
const sec = (name) => post.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`))?.[1].trim() ?? '';
const caption = sec('Legenda');
const tags = sec('Hashtags');
if (!caption) errors.push('post.md sem legenda');
const full = `${caption}\n\n${tags}`.trim();
if (full.length > 2200) errors.push(`legenda + hashtags com ${full.length} caracteres (máx. 2.200)`);
else ok.push(`legenda: ${full.length}/2200 caracteres`);
const nTags = (full.match(/#[\p{L}\p{N}_]+/gu) ?? []).length;
if (nTags > 30) errors.push(`${nTags} hashtags (máx. 30)`);
else if (nTags > 10) warns.push(`${nTags} hashtags (recomendado ≤ 10)`);
else ok.push(`hashtags: ${nTags}`);

// saída
console.log(`check-post ${brand}/${day}`);
for (const e of errors) console.log(`  ❌ ${e}`);
for (const w of warns) console.log(`  ⚠️  ${w}`);
for (const o of ok) console.log(`  ✅ ${o}`);
console.log(errors.length ? `RESULTADO: FALHOU (${errors.length} erro(s))` : `RESULTADO: PASSOU${warns.length ? ` com ${warns.length} aviso(s)` : ''}`);
process.exit(errors.length ? 1 : 0);
