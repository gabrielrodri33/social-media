// Narração para vídeo animado (GrowKaz Stickman Studio) com tempo POR PALAVRA, sem Whisper.
// Uso: node scripts/animacao-voz.mjs <marca> <roteiro.txt> <pasta-saida> [--tempo=1.15]
// Gera <pasta-saida>/voice.mp3 e <pasta-saida>/script.json ({words:[{word,start,end}]}), já com a aceleração aplicada.
// Depois: python3 tools/new_project.py ... --voice <saida>/voice.mp3 --script <saida>/script.json  e  tools/parse_script.py.
// Voz e ajustes: brands/<marca>/voice.json. Chave: Network secret (header xi-api-key) ou ELEVENLABS_API_KEY.
import './_proxy.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const [marca, roteiro, saida, ...rest] = process.argv.slice(2);
if (!marca || !roteiro || !saida) { console.error('uso: node scripts/animacao-voz.mjs <marca> <roteiro.txt> <pasta-saida> [--tempo=1.15]'); process.exit(1); }
const tempo = Number((rest.find(a => a.startsWith('--tempo=')) || '--tempo=1').split('=')[1]);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const v = JSON.parse(fs.readFileSync(path.join(root, 'brands', marca, 'voice.json'), 'utf8'));
const text = fs.readFileSync(roteiro, 'utf8').trim().replace(/\s*\n\s*/g, ' ');
fs.mkdirSync(saida, {recursive: true});

const headers = {'Content-Type': 'application/json'};
if (process.env.ELEVENLABS_API_KEY) headers['xi-api-key'] = process.env.ELEVENLABS_API_KEY;
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice_id}/with-timestamps`, {method: 'POST', headers,
  body: JSON.stringify({text, model_id: v.model_id, language_code: v.language_code, voice_settings: v.voice_settings})});
if (!r.ok) { console.error('ElevenLabs', r.status, await r.text()); process.exit(1); }
const j = await r.json();

// caracteres -> palavras
const a = j.alignment, words = [];
let cur = null;
for (let i = 0; i < a.characters.length; i++) {
  const c = a.characters[i];
  if (/\s/.test(c)) { if (cur) { words.push(cur); cur = null; } continue; }
  if (!cur) cur = {word: '', start: a.character_start_times_seconds[i], end: 0};
  cur.word += c; cur.end = a.character_end_times_seconds[i];
}
if (cur) words.push(cur);

const raw = path.join(saida, 'voice-raw.mp3'), out = path.join(saida, 'voice.mp3');
fs.writeFileSync(raw, Buffer.from(j.audio_base64, 'base64'));
if (tempo !== 1) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-filter:a', `atempo=${tempo}`, '-ar', '44100', out]);
  fs.unlinkSync(raw);
  for (const w of words) { w.start = +(w.start / tempo).toFixed(3); w.end = +(w.end / tempo).toFixed(3); }
} else fs.renameSync(raw, out);
fs.writeFileSync(path.join(saida, 'script.json'), JSON.stringify({words}, null, 1));
console.log(`OK: ${words.length} palavras, ${words.at(-1).end.toFixed(2)} s (tempo ${tempo}) -> ${saida}`);
