#!/usr/bin/env node
// Narração com ElevenLabs: node scripts/tts.mjs <marca> <pasta-do-dia>
// Lê brands/<marca>/voice.json e <dia>/voice.txt (UMA LINHA POR CENA do reel, mesma ordem de props.scenes).
// Grava <dia>/voice.mp3 e <dia>/voice-timings.json ({timings: início de cada cena em s, audioDuration}).
// Chave: header xi-api-key. No cloud, a credencial salva no ambiente é injetada pelo proxy;
// localmente, use ELEVENLABS_API_KEY.
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import './_proxy.mjs';

const [brand, postDir] = process.argv.slice(2);
if (!brand || !postDir) {
  console.error('Uso: node scripts/tts.mjs <marca> <pasta-do-dia>');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cfg = JSON.parse(readFileSync(path.join(root, 'brands', brand, 'voice.json'), 'utf8'));
const lines = readFileSync(path.join(postDir, 'voice.txt'), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const propsFile = path.join(postDir, 'props.json');
if (existsSync(propsFile)) {
  const n = JSON.parse(readFileSync(propsFile, 'utf8')).scenes?.length;
  if (n && n !== lines.length) {
    console.error(`voice.txt tem ${lines.length} linhas, mas props.json tem ${n} cenas. Precisa ser 1 linha por cena.`);
    process.exit(1);
  }
}
const text = lines.join(' ');
const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice_id}/with-timestamps?output_format=mp3_44100_128`, {
  method: 'POST',
  // Sem ELEVENLABS_API_KEY, não manda header de chave: o proxy injeta a credencial salva no ambiente.
  headers: {...(process.env.ELEVENLABS_API_KEY ? {'xi-api-key': process.env.ELEVENLABS_API_KEY} : {}), 'Content-Type': 'application/json'},
  body: JSON.stringify({text, model_id: cfg.model_id, language_code: cfg.language_code, voice_settings: cfg.voice_settings}),
});
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
const a = data.alignment;
// Início de cada linha = tempo do primeiro caractere dela no texto enviado.
let offset = 0;
const timings = lines.map((l) => {
  const t = a.character_start_times_seconds[offset] ?? 0;
  offset += l.length + 1;
  return Math.max(0, Number(t.toFixed(3)));
});
timings[0] = 0;
const audioDuration = Number(a.character_end_times_seconds.at(-1).toFixed(3));
writeFileSync(path.join(postDir, 'voice.mp3'), Buffer.from(data.audio_base64, 'base64'));
writeFileSync(path.join(postDir, 'voice-timings.json'), JSON.stringify({timings, audioDuration}, null, 2) + '\n');
console.log(`OK: voice.mp3 (${audioDuration}s, ${lines.length} cenas)`);
