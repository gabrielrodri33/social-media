#!/usr/bin/env node
// Fotos do Unsplash (licença Unsplash: uso comercial, sem marca d'água, crédito não obrigatório).
//   node scripts/unsplash.mjs search "<termos em inglês>" [--orientation=portrait|landscape|squarish] [--n=12] [--page=1]
//   node scripts/unsplash.mjs get <photo_id> <marca> [nome-do-arquivo]
// `get` dispara o endpoint de download (exigência da API), salva em brands/<marca>/assets/unsplash/
// e registra autor + links em brands/<marca>/assets/unsplash/CREDITS.json.
// Chave: Network secret do ambiente (Authorization: Client-ID <access key>) ou UNSPLASH_ACCESS_KEY.
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import './_proxy.mjs';

const API = 'https://api.unsplash.com';
const UTM = 'utm_source=social_media_studio&utm_medium=referral';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [cmd, ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const pos = rest.filter((a) => !a.startsWith('--'));

const headers = {'Accept-Version': 'v1', ...(process.env.UNSPLASH_ACCESS_KEY ? {Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`} : {})};
const api = async (url) => {
  const r = await fetch(url.startsWith('http') ? url : API + url, {headers});
  if (!r.ok) throw new Error(`Unsplash ${r.status}: ${await r.text()}`);
  const left = r.headers.get('x-ratelimit-remaining');
  if (left !== null && Number(left) < 10) console.error(`(atenção: restam ${left} requisições nesta hora)`);
  return r.json();
};

if (cmd === 'search') {
  const q = new URLSearchParams({query: pos[0] ?? '', per_page: flags.n ?? '12', page: flags.page ?? '1', content_filter: 'high'});
  if (flags.orientation) q.set('orientation', flags.orientation);
  const data = await api(`/search/photos?${q}`);
  console.log(`${data.total} resultados para "${pos[0]}"`);
  for (const p of data.results) {
    console.log(`${p.id}\t${p.width}x${p.height}\t${p.user.name}\t${(p.alt_description ?? p.description ?? '').slice(0, 80)}\t${p.urls.small}`);
  }
} else if (cmd === 'get') {
  const [id, brand, name] = pos;
  if (!id || !brand) throw new Error('Uso: get <photo_id> <marca> [nome]');
  const p = await api(`/photos/${id}`);
  const dl = await api(p.links.download_location); // obrigatório pelas diretrizes da API
  const img = await fetch(`${dl.url}&w=2400&fm=jpg&q=85`);
  if (!img.ok) throw new Error(`download ${img.status}`);
  const dir = path.join(root, 'brands', brand, 'assets', 'unsplash');
  mkdirSync(dir, {recursive: true});
  const file = `${name ?? id}.jpg`;
  writeFileSync(path.join(dir, file), Buffer.from(await img.arrayBuffer()));
  const credFile = path.join(dir, 'CREDITS.json');
  const credits = existsSync(credFile) ? JSON.parse(readFileSync(credFile, 'utf8')) : {};
  credits[file] = {
    id, photographer: p.user.name, photographer_url: `${p.user.links.html}?${UTM}`,
    photo_url: `${p.links.html}?${UTM}`, license: 'Unsplash License (https://unsplash.com/license)',
    description: p.alt_description ?? p.description ?? '', downloaded: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(credFile, JSON.stringify(credits, null, 2) + '\n');
  console.log(`OK brands/${brand}/assets/unsplash/${file} (foto de ${p.user.name})`);
  console.log(`Crédito sugerido: Photo by ${p.user.name} on Unsplash`);
} else {
  console.log('Uso: search "<termos>" [--orientation=portrait] [--n=12] | get <id> <marca> [nome]');
}
